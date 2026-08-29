import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { WeddingsOverview } from './screens/WeddingsOverview'
import { VendorDirectory } from './screens/VendorDirectory'
import { NewWedding } from './screens/NewWedding'
import { WeddingDetail } from './screens/WeddingDetail'

/** The four trades the directory is split into. */
export const DIRECTORY_TABS = ['catering', 'photographers', 'locations', 'djs'] as const

/** Keyed on the tab so switching trades starts from a clean search box. */
function DirectoryRoute() {
  const { tab } = useParams()
  return <VendorDirectory key={tab} />
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/weddings" replace />} />
      <Route path="/weddings" element={<WeddingsOverview />} />
      <Route path="/weddings/new" element={<NewWedding />} />
      <Route path="/weddings/:id" element={<WeddingDetail />} />
      <Route path="/weddings/:id/edit" element={<NewWedding />} />

      {/*
        Namespaced, where it used to be a bare `/:tab`.

        That pattern matched any single segment, so the directory was the
        fallback for the entire top level. React Router ranks static segments
        above dynamic ones, so `/login` would have won today — but resting an
        auth boundary on rank ordering is not something to leave in place, and
        the next plain `/settings` route would have silently rendered the
        vendor directory instead.
      */}
      <Route path="/directory/:tab" element={<DirectoryRoute />} />

      {/* The four links the mock shipped with still work. */}
      {DIRECTORY_TABS.map((tab) => (
        <Route key={tab} path={`/${tab}`} element={<Navigate to={`/directory/${tab}`} replace />} />
      ))}

      <Route path="*" element={<Navigate to="/weddings" replace />} />
    </Routes>
  )
}
