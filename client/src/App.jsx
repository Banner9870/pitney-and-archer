import { Routes, Route, Navigate } from 'react-router-dom'
import FeedPage from './pages/FeedPage/FeedPage.jsx'
import ExplorePage from './pages/ExplorePage/ExplorePage.jsx'
import GuideCreatePage from './pages/GuideCreatePage/GuideCreatePage.jsx'
import GuideDetailPage from './pages/GuideDetailPage/GuideDetailPage.jsx'
import GuideRemixPage from './pages/GuideRemixPage/GuideRemixPage.jsx'
import NeighborhoodPage from './pages/NeighborhoodPage/NeighborhoodPage.jsx'
import ProfilePage from './pages/ProfilePage/ProfilePage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/feed" replace />} />
      <Route path="/feed" element={<FeedPage />} />
      <Route path="/explore" element={<ExplorePage />} />
      {/* CRITICAL: /guide/new MUST come before /guide/:id */}
      <Route path="/guide/new" element={<GuideCreatePage />} />
      <Route path="/guide/:id" element={<GuideDetailPage />} />
      <Route path="/guide/:id/remix" element={<GuideRemixPage />} />
      <Route path="/neighborhood/:slug" element={<NeighborhoodPage />} />
      <Route path="/profile/:handle" element={<ProfilePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
