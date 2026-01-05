import { useEffect, useMemo, useState, Suspense, lazy } from 'react'
import { Container, Box, CircularProgress, CssBaseline, ThemeProvider } from '@mui/material'
import { Routes, Route, useLocation } from 'react-router-dom'
import { SWRConfig, useSWRConfig } from 'swr'
import { AnimatePresence } from 'framer-motion'
import { ErrorBoundary } from 'react-error-boundary'

import { getTheme } from '@/lib/theme'
import { api, trackPageVisit } from '@/lib/axios'
import { initWebSocket } from './websocket'

// Layouts
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import AdminHeader from './components/layout/admin/AdminHeader'
import AnimatedBackground from './components/ui/AnimatedBackground'
import Interactive3D from './components/ui/Interactive3D'
import InteractiveBackground from './components/ui/InteractiveBackground'
import ErrorFallback from './components/ui/ErrorFallback'

// Auth
import AuthProvider from './features/auth/context/AuthProvider'
import PrivateRoute from './features/auth/components/PrivateRoute'
import LoginPage from './features/auth/routes/LoginPage'

// Pages (Lazy Load)
const Home = lazy(() => import('./pages/Home'))
const Projects = lazy(() => import('./pages/Projects'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const About = lazy(() => import('./pages/About'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Admin Pages
const DashboardPage = lazy(() => import('./features/dashboard/routes/DashboardPage'))
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'))
const ProjectEdit = lazy(() => import('./pages/admin/ProjectEdit'))
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile'))
const AdminSkills = lazy(() => import('./pages/admin/AdminSkills'))
const AdminExperiences = lazy(() => import('./pages/admin/AdminExperiences'))
const AdminAchievements = lazy(() => import('./pages/admin/AdminAchievements'))
const AnalyticsPage = lazy(() => import('./features/analytics/routes/AnalyticsPage'))

const LoadingScreen = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
)

function PublicLayout({ children, mode, toggleMode }: { children: React.ReactNode; mode: 'light' | 'dark'; toggleMode: () => void }) {
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header mode={mode} toggleMode={toggleMode} />
      {isHomePage ? children : (
        <>
          <Container component="main" sx={{ flex: 1, position: 'relative', zIndex: 1, py: 4 }}>
            {children}
          </Container>
          <Footer />
        </>
      )}
    </Box>
  )
}

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AdminHeader />
      <Container component="main" sx={{ py: 4, flex: 1 }}>
        {children}
      </Container>
      <Footer />
    </Box>
  )
}

function WebSocketInitializer() {
  const { mutate } = useSWRConfig()

  useEffect(() => {
    initWebSocket((key) => {
      console.log('♻️ Live Update:', key)
      return mutate(key)
    })
  }, [mutate])

  return null
}

function App() {
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const isAdminPage = location.pathname.startsWith('/admin')
  const isPublicNonHomePage = !isHomePage && !isAdminPage

  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark'
  })

  const theme = useMemo(() => getTheme(mode), [mode])

  useEffect(() => {
    localStorage.setItem('theme', mode)
    document.body.setAttribute('data-color-mode', mode)
    if (isAdminPage) document.body.classList.add('admin-background')
    else document.body.classList.remove('admin-background')
  }, [mode, isAdminPage])

  useEffect(() => {
    if (!isAdminPage) trackPageVisit(location.pathname)
  }, [location.pathname, isAdminPage])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <SWRConfig value={{
          fetcher: (url) => api.get(url).then(res => res.data),
          revalidateOnFocus: false
        }}>
          <WebSocketInitializer />

          <AuthProvider>
            {isHomePage && <Suspense fallback={null}><Interactive3D /></Suspense>}
            {isPublicNonHomePage && (
              <>
                <AnimatedBackground />
                <Suspense fallback={null}><InteractiveBackground /></Suspense>
              </>
            )}

            <AnimatePresence mode="wait">
              <Suspense fallback={<LoadingScreen />}>
                <Routes location={location} key={location.pathname}>
                  {/* Public Routes */}
                  <Route path="/" element={<PublicLayout mode={mode} toggleMode={() => setMode(m => m === 'light' ? 'dark' : 'light')}><Home /></PublicLayout>} />
                  <Route path="/projects" element={<PublicLayout mode={mode} toggleMode={() => setMode(m => m === 'light' ? 'dark' : 'light')}><Projects /></PublicLayout>} />
                  <Route path="/projects/:slug" element={<PublicLayout mode={mode} toggleMode={() => setMode(m => m === 'light' ? 'dark' : 'light')}><ProjectDetail /></PublicLayout>} />
                  <Route path="/about" element={<PublicLayout mode={mode} toggleMode={() => setMode(m => m === 'light' ? 'dark' : 'light')}><About /></PublicLayout>} />

                  {/* Admin Auth */}
                  <Route path="/admin/login" element={<LoginPage />} />

                  {/* Protected Admin Routes */}
                  <Route path="/admin" element={<PrivateRoute><AdminLayout><DashboardPage /></AdminLayout></PrivateRoute>} />
                  <Route path="/admin/projects" element={<PrivateRoute><AdminLayout><AdminProjects /></AdminLayout></PrivateRoute>} />
                  <Route path="/admin/projects/new" element={<PrivateRoute><AdminLayout><ProjectEdit mode="create" /></AdminLayout></PrivateRoute>} />
                  <Route path="/admin/projects/:id" element={<PrivateRoute><AdminLayout><ProjectEdit mode="edit" /></AdminLayout></PrivateRoute>} />
                  <Route path="/admin/profile" element={<PrivateRoute><AdminLayout><AdminProfile /></AdminLayout></PrivateRoute>} />
                  <Route path="/admin/skills" element={<PrivateRoute><AdminLayout><AdminSkills /></AdminLayout></PrivateRoute>} />
                  <Route path="/admin/experiences" element={<PrivateRoute><AdminLayout><AdminExperiences /></AdminLayout></PrivateRoute>} />
                  <Route path="/admin/achievements" element={<PrivateRoute><AdminLayout><AdminAchievements /></AdminLayout></PrivateRoute>} />
                  <Route path="/admin/analytics" element={<PrivateRoute><AdminLayout><AnalyticsPage /></AdminLayout></PrivateRoute>} />

                  {/* 404 Route */}
                  <Route path="*" element={<PublicLayout mode={mode} toggleMode={() => setMode(m => m === 'light' ? 'dark' : 'light')}><NotFound /></PublicLayout>} />
                </Routes>
              </Suspense>
            </AnimatePresence>
          </AuthProvider>
        </SWRConfig>
      </ErrorBoundary>
    </ThemeProvider>
  )
}

export default App