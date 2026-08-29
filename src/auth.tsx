import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { api, ApiError, SIGNED_OUT_EVENT } from './api/client'
import type { Me, Role } from './api/client'

type AuthState = {
  user: Me | null
  /** True until the first `/api/me` settles — distinct from "signed out". */
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

/**
 * Who is signed in.
 *
 * The session is an httpOnly cookie, so the app cannot read it and does not
 * try. It asks the server once on load and keeps the answer; a 401 from any
 * later call fires {@link SIGNED_OUT_EVENT} and drops the user here, which is
 * what stops an expired session leaving someone clicking buttons that quietly
 * do nothing.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Me | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    api
      .me()
      .then((me) => {
        if (!cancelled) setUser(me.user)
      })
      // A 401 here is the normal not-signed-in case, not an error worth showing.
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const onSignedOut = () => setUser(null)
    window.addEventListener(SIGNED_OUT_EVENT, onSignedOut)
    return () => window.removeEventListener(SIGNED_OUT_EVENT, onSignedOut)
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const me = await api.login(email, password)
    setUser(me.user)
  }, [])

  const signOut = useCallback(async () => {
    try {
      await api.logout()
    } finally {
      // Whatever the server said, this browser is done with the session.
      setUser(null)
    }
  }, [])

  const value = useMemo(
    () => ({ user, loading, signIn, signOut }),
    [user, loading, signIn, signOut],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth used outside AuthProvider')
  return value
}

/**
 * Gates a route on a role.
 *
 * `loading` renders nothing rather than the sign-in screen: showing a login
 * form for the half-second before `/api/me` answers would flash it at everyone
 * who is already signed in, on every reload.
 *
 * The redirect remembers where it came from, so signing in returns to the page
 * that was asked for rather than dumping everyone on the overview.
 */
export function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return null
  if (!user) {
    const to = role === 'DJ' ? '/dj/login' : '/login'
    return <Navigate to={to} replace state={{ from: location.pathname + location.search }} />
  }
  if (user.role !== role) {
    // Signed in, wrong door. Send them to their own start page rather than to
    // a login form they have already filled in.
    return <Navigate to={user.role === 'DJ' ? '/dj' : '/weddings'} replace />
  }
  return <>{children}</>
}

/** The message to show for a failed sign-in, by the code the server sent. */
export function signInMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.code) {
      case 'BAD_CREDENTIALS':
        // Deliberately the same for an unknown address and a wrong password:
        // the server answers identically so this cannot be used to find out
        // who has an account.
        return 'That email and password do not match.'
      case 'ACCOUNT_DISABLED':
        return 'That account has been disabled. Ask your planner to re-enable it.'
      case 'RATE_LIMITED':
        return 'Too many attempts. Wait a minute and try again.'
      default:
        return error.message
    }
  }
  return 'Could not reach the server. Check your connection and try again.'
}
