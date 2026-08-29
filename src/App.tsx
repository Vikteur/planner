import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { WeddingsOverview } from './screens/WeddingsOverview'
import { VendorDirectory } from './screens/VendorDirectory'
import { NewWedding } from './screens/NewWedding'
import { WeddingDetail } from './screens/WeddingDetail'
import { SignIn } from './screens/SignIn'
import { RequireRole } from './auth'

/** The four trades the directory is split into. */
export const DIRECTORY_TABS = ['catering', 'photographers', 'locations', 'djs'] as const

/** Keyed on the tab so switching trades starts from a clean search box. */
function DirectoryRoute() {
  const { tab } = useParams()
  return <VendorDirectory key={tab} />
}

/** Everything a planner sees. One guard, wrapped once, rather than per screen. */
function Planner({ children }: { children: React.ReactNode }) {
  return <RequireRole role="PLANNER">{children}</RequireRole>
}

export function App() {
  return (
    <Routes>
      {/*
        Two doors, one form. A DJ handed a link should not land on a screen
        that talks about "your weddings" — but the server decides the role from
        the account, so signing in at the wrong door still works and simply
        redirects. Making it a real boundary would mean answering "no account
        of that kind here", which tells an attacker which accounts exist.
      */}
      <Route path="/login" element={<SignIn door="PLANNER" />} />
      <Route path="/dj/login" element={<SignIn door="DJ" />} />

      <Route path="/" element={<Navigate to="/weddings" replace />} />
      <Route path="/weddings" element={<Planner><WeddingsOverview /></Planner>} />
      <Route path="/weddings/new" element={<Planner><NewWedding /></Planner>} />
      <Route path="/weddings/:id" element={<Planner><WeddingDetail /></Planner>} />
      <Route path="/weddings/:id/edit" element={<Planner><NewWedding /></Planner>} />

      {/*
        Namespaced, where it used to be a bare `/:tab`.

        That pattern matched any single segment, so the directory was the
        fallback for the entire top level. React Router ranks static segments
        above dynamic ones, so `/login` would have won today — but resting an
        auth boundary on rank ordering is not something to leave in place, and
        the next plain `/settings` route would have silently rendered the
        vendor directory instead.
      */}
      <Route path="/directory/:tab" element={<Planner><DirectoryRoute /></Planner>} />

      {/* The four links the mock shipped with still work. */}
      {DIRECTORY_TABS.map((tab) => (
        <Route key={tab} path={`/${tab}`} element={<Navigate to={`/directory/${tab}`} replace />} />
      ))}

      <Route path="*" element={<Navigate to="/weddings" replace />} />
    </Routes>
  )
}
