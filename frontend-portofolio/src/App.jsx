//src/App.jsx
import { useEffect, useMemo, useState, Suspense } from 'react'
import { Container, Box } from '@mui/material'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { getTheme } from './theme'
import { AnimatePresence, motion as Motion } from 'framer-motion'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import About from './pages/About'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import AdminProjects from './pages/admin/AdminProjects'
import AdminProfile from './pages/admin/AdminProfile'
import AdminSkills from './pages/admin/AdminSkills'
import AdminExperiences from './pages/admin/AdminExperiences'
import AdminAchievements from './pages/admin/AdminAchievements'
import PrivateRoute from './auth/PrivateRoute'
import AdminHeader from './components/layout/admin/AdminHeader'
import AnimatedBackground from './components/ui/AnimatedBackground'
import Interactive3D from './components/ui/Interactive3D'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
}

function PageLayout({ children }) {
  return (
    <Motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
      {children}
    </Motion.div>
  )
}

function PublicLayout({ children, mode, toggleMode }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header mode={mode} toggleMode={toggleMode} />
      {isHomePage ? (
        children
      ) : (
        <>
          <Container component="main" sx={{ flex: 1, position: 'relative', zIndex: 1, py: 4 }}>
            <PageLayout>{children}</PageLayout>
          </Container>
          <Footer />
        </>
      )}
    </Box>
  );
}

function AdminLayout({ children }) {
  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <AdminHeader />
      <Container component="main" sx={{ py: 4, position: 'relative', zIndex: 1, flex: 1 }}>
        <PageLayout>{children}</PageLayout>
      </Container>
      <Footer />
    </Box>
  )
}

export default function App() {
  const location = useLocation()
  const isHomePage = location.pathname === '/';

  const initialMode = (() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') return saved
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })()
  const [mode, setMode] = useState(initialMode)
  const theme = useMemo(() => getTheme(mode), [mode])

  useEffect(() => {
    localStorage.setItem('theme', mode)
    document.body.setAttribute('data-color-mode', mode)
  }, [mode])

  const toggleMode = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'))

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {isHomePage ? (
        <Suspense fallback={null}><Interactive3D /></Suspense>
      ) : (
        <AnimatedBackground />
      )}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PublicLayout mode={mode} toggleMode={toggleMode}><Home /></PublicLayout>} />
          <Route path="/projects" element={<PublicLayout mode={mode} toggleMode={toggleMode}><Projects /></PublicLayout>} />
          <Route path="/projects/:slug" element={<PublicLayout mode={mode} toggleMode={toggleMode}><ProjectDetail /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout mode={mode} toggleMode={toggleMode}><About /></PublicLayout>} />

          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<PrivateRoute><AdminLayout><Dashboard /></AdminLayout></PrivateRoute>} />
          <Route path="/admin/projects" element={<PrivateRoute><AdminLayout><AdminProjects /></AdminLayout></PrivateRoute>} />
          <Route path="/admin/profile" element={<PrivateRoute><AdminLayout><AdminProfile /></AdminLayout></PrivateRoute>} />
          <Route path="/admin/skills" element={<PrivateRoute><AdminLayout><AdminSkills /></AdminLayout></PrivateRoute>} />
          <Route path="/admin/experiences" element={<PrivateRoute><AdminLayout><AdminExperiences /></AdminLayout></PrivateRoute>} />
          <Route path="/admin/achievements" element={<PrivateRoute><AdminLayout><AdminAchievements /></AdminLayout></PrivateRoute>} />
        </Routes>
      </AnimatePresence>
    </ThemeProvider>
  )
}