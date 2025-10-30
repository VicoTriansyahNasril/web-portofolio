import { useEffect, useMemo, useState, Suspense, ReactNode } from 'react';
import { Container, Box } from '@mui/material';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from './theme';
import { AnimatePresence, motion as Motion, Transition } from 'framer-motion';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AdminHeader from './components/layout/admin/AdminHeader';
import AnimatedBackground from './components/ui/AnimatedBackground';
import Interactive3D from './components/ui/Interactive3D';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import About from './pages/About';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminProfile from './pages/admin/AdminProfile';
import AdminSkills from './pages/admin/AdminSkills';
import AdminExperiences from './pages/admin/AdminExperiences';
import AdminAchievements from './pages/admin/AdminAchievements';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import PrivateRoute from './auth/PrivateRoute';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition: Transition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <Motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
      <Container sx={{ py: 4 }}>
        {children}
      </Container>
    </Motion.div>
  );
}

function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AdminHeader />
      <Container component="main" sx={{ py: 4, flex: 1 }}>
        <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {children}
        </Motion.div>
      </Container>
      <Footer />
    </Box>
  );
}

export default function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const initialMode = (() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  })();
  const [mode, setMode] = useState<'light' | 'dark'>(initialMode);
  const theme = useMemo(() => getTheme(mode), [mode]);

  useEffect(() => {
    localStorage.setItem('theme', mode);
    document.body.setAttribute('data-color-mode', mode);
  }, [mode]);

  const toggleMode = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ position: 'relative', minHeight: '100vh' }}>
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          {isHomePage ? (
            <Suspense fallback={null}><Interactive3D /></Suspense>
          ) : (
            <AnimatedBackground />
          )}
        </Box>

        <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header mode={mode} toggleMode={toggleMode} />
          <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<PageWrapper><Projects /></PageWrapper>} />
                <Route path="/projects/:slug" element={<PageWrapper><ProjectDetail /></PageWrapper>} />
                <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />

                <Route path="/admin/login" element={<Login />} />
                <Route path="/admin" element={<PrivateRoute><AdminLayout><Dashboard /></AdminLayout></PrivateRoute>} />
                <Route path="/admin/projects" element={<PrivateRoute><AdminLayout><AdminProjects /></AdminLayout></PrivateRoute>} />
                <Route path="/admin/profile" element={<PrivateRoute><AdminLayout><AdminProfile /></AdminLayout></PrivateRoute>} />
                <Route path="/admin/skills" element={<PrivateRoute><AdminLayout><AdminSkills /></AdminLayout></PrivateRoute>} />
                <Route path="/admin/experiences" element={<PrivateRoute><AdminLayout><AdminExperiences /></AdminLayout></PrivateRoute>} />
                <Route path="/admin/achievements" element={<PrivateRoute><AdminLayout><AdminAchievements /></AdminLayout></PrivateRoute>} />
                <Route path="/admin/analytics" element={<PrivateRoute><AdminLayout><AdminAnalytics /></AdminLayout></PrivateRoute>} />
              </Routes>
            </AnimatePresence>
          </Box>
          <Footer />
        </Box>
      </Box>
    </ThemeProvider>
  );
}