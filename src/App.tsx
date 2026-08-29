import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { WeddingsOverview } from './screens/WeddingsOverview'
import { VendorDirectory } from './screens/VendorDirectory'
import { NewWedding } from './screens/NewWedding'
import { WeddingDetail } from './screens/WeddingDetail'

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
      <Route path="/:tab" element={<DirectoryRoute />} />
      <Route path="*" element={<Navigate to="/weddings" replace />} />
    </Routes>
  )
}

