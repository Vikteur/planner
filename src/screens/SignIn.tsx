import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Hov } from '../components/Hov'
import { c, family, mono } from '../theme'
import { signInMessage, useAuth } from '../auth'
import type { Role } from '../api/client'

/**
 * Sign-in, for one of the two doors.
 *
 * The planner and the DJ get separate URLs but the same form and the same
 * endpoint — the server decides the role from the account, not from which page
 * asked. Two doors is a wayfinding choice, so a DJ handed a link does not land
 * on a screen that talks about "your weddings"; it is not a security boundary,
 * and building it as one would mean an account could sign in at the wrong door
 * and be told something true about which accounts exist.
 */
export function SignIn({ door }: { door: Role }) {
  const { user, loading, signIn } = useAuth()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const from = (location.state as { from?: string } | null)?.from

  if (loading) return null
  if (user) {
    // Already signed in — go where they were headed, or to their own start.
    return <Navigate to={from ?? (user.role === 'DJ' ? '/dj' : '/weddings')} replace />
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (busy) return
    setBusy(true)
    setError(null)
    try {
      await signIn(email.trim(), password)
    } catch (caught) {
      setError(signInMessage(caught))
      setPassword('')
    } finally {
      setBusy(false)
    }
  }

  const isDj = door === 'DJ'

  return (
    <div
      style={{
        minHeight: '100vh',
        background: c.shell,
        fontFamily: family.sans,
        color: c.ink,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <form
        onSubmit={submit}
        style={{
          width: '100%',
          maxWidth: 380,
          background: c.white,
          border: `1px solid ${c.line}`,
          borderRadius: 14,
          padding: '28px 26px',
        }}
      >
        <div style={{ font: mono(600, '9.5px'), letterSpacing: '.2em', color: c.muteSoft }}>
          REKORD MATCH
        </div>
        <h1
          style={{
            margin: '10px 0 0',
            fontFamily: family.serif,
            fontStyle: 'italic',
            fontSize: 27,
            fontWeight: 600,
            lineHeight: 1.15,
          }}
        >
          {isDj ? 'DJ sign-in.' : 'Planner sign-in.'}
        </h1>
        <p style={{ margin: '6px 0 0', fontSize: 12.5, color: c.inkSoft }}>
          {isDj
            ? 'Your weddings, their music, and your library.'
            : 'Your weddings, your vendors and the day itself.'}
        </p>

        <label style={labelStyle} htmlFor="email">
          EMAIL
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          required
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <label style={labelStyle} htmlFor="password">
          PASSWORD
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        {error && (
          <div
            role="alert"
            style={{
              marginTop: 12,
              fontSize: 12,
              color: '#8a3c3c',
              background: 'rgba(138,60,60,.07)',
              border: '1px solid rgba(138,60,60,.18)',
              borderRadius: 9,
              padding: '8px 11px',
            }}
          >
            {error}
          </div>
        )}

        <Hov
          as="button"
          type="submit"
          disabled={busy}
          style={{
            marginTop: 16,
            width: '100%',
            border: 'none',
            borderRadius: 999,
            background: c.ink,
            color: c.shell,
            padding: '10px 16px',
            fontSize: 12.5,
            fontWeight: 600,
            cursor: busy ? 'default' : 'pointer',
            opacity: busy ? 0.6 : 1,
          }}
          hover={{ background: c.inkHover }}
        >
          {busy ? 'Signing in…' : 'Sign in'}
        </Hov>

        <p style={{ margin: '14px 0 0', fontSize: 11, color: c.mute }}>
          {isDj
            ? 'No account? Your planner sends the invite — the link in it sets your password.'
            : 'Accounts are made by invitation. Ask whoever set up your organisation.'}
        </p>
      </form>
    </div>
  )
}

const labelStyle = {
  display: 'block',
  marginTop: 16,
  font: mono(600, '8.5px'),
  letterSpacing: '.14em',
  color: c.muteSoft,
} as const

const inputStyle = {
  marginTop: 5,
  width: '100%',
  boxSizing: 'border-box',
  border: `1px solid ${c.line}`,
  borderRadius: 9,
  background: c.cream,
  padding: '9px 11px',
  fontSize: 13,
  color: c.ink,
  fontFamily: 'inherit',
} as const
