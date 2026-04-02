import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header/Header.jsx'
import Footer from './components/Footer/Footer.jsx'
import Layout from './components/Layout/Layout.jsx'
import Toast from './components/Toast/Toast.jsx'
import useToast from './components/Toast/useToast.js'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.jsx'
import { useAppContext } from './context/AppContext.jsx'
import FeedPage from './pages/FeedPage/FeedPage.jsx'
import ExplorePage from './pages/ExplorePage/ExplorePage.jsx'
import GuideCreatePage from './pages/GuideCreatePage/GuideCreatePage.jsx'
import GuideDetailPage from './pages/GuideDetailPage/GuideDetailPage.jsx'
import GuideRemixPage from './pages/GuideRemixPage/GuideRemixPage.jsx'
import NeighborhoodPage from './pages/NeighborhoodPage/NeighborhoodPage.jsx'
import ProfilePage from './pages/ProfilePage/ProfilePage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

export default function App() {
  const { message, visible, showToast, dismiss } = useToast()
  const { dispatch } = useAppContext()

  useEffect(() => {
    let shiftDownAt = null
    const onKeyDown = (e) => { if (e.key === 'R' && e.shiftKey) shiftDownAt = Date.now() }
    const onKeyUp = (e) => {
      if (e.key === 'R' && shiftDownAt && Date.now() - shiftDownAt >= 2000) {
        dispatch({ type: 'RESET_SESSION' })
        showToast('Session reset')
      }
      shiftDownAt = null
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => { window.removeEventListener('keydown', onKeyDown); window.removeEventListener('keyup', onKeyUp) }
  }, [dispatch, showToast])

  return (
    <ErrorBoundary>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/feed" replace />} />
            <Route
              path="/feed"
              element={
                <Layout sidebar={true}>
                  <FeedPage />
                </Layout>
              }
            />
            <Route
              path="/explore"
              element={
                <Layout sidebar={true}>
                  <ExplorePage />
                </Layout>
              }
            />
            {/* CRITICAL: /guide/new MUST come before /guide/:id */}
            <Route
              path="/guide/new"
              element={
                <Layout>
                  <GuideCreatePage />
                </Layout>
              }
            />
            <Route
              path="/guide/:id"
              element={
                <Layout>
                  <GuideDetailPage />
                </Layout>
              }
            />
            <Route
              path="/guide/:id/remix"
              element={
                <Layout>
                  <GuideRemixPage />
                </Layout>
              }
            />
            <Route
              path="/neighborhood/:slug"
              element={
                <Layout>
                  <NeighborhoodPage />
                </Layout>
              }
            />
            <Route
              path="/profile/:handle"
              element={
                <Layout>
                  <ProfilePage />
                </Layout>
              }
            />
            <Route
              path="*"
              element={
                <Layout>
                  <NotFoundPage />
                </Layout>
              }
            />
          </Routes>
        </main>
        <Footer />
        <Toast message={message} visible={visible} onDismiss={dismiss} />
      </div>
    </ErrorBoundary>
  )
}
