import { useEffect, useMemo, useState, Suspense, ReactNode, lazy } from 'react';
import { Container, Box, CircularProgress } from '@mui/material';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from './theme';
import { AnimatePresence, motion as Motion, Transition } from 'framer-motion';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AdminHeader from './components/layout/admin/AdminHeader';
import AnimatedBackground from './components/ui/AnimatedBackground';
import PrivateRoute from './auth/PrivateRoute';

const Home = lazy(() => import('./pages/Home'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const About = lazy(() => import('./pages/About'));
const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'));
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile'));
const AdminSkills = lazy(() => import('./pages/admin/AdminSkills'));
const AdminExperiences = lazy(() => import('./pages/admin/AdminExperiences'));
const AdminAchievements = lazy(() => import('./pages/admin/AdminAchievements'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const Interactive3D = lazy(() => import('./components/ui/Interactive3D'));
const InteractiveBackground = lazy(() => import('./components/ui/InteractiveBackground'));

const pageVariants = {
  initial: { opacity: 0, y: 20 }, in: { opacity: 1, y: 0 }, out: { opacity: 0, y: -20 },
};
const pageTransition: Transition = { type: 'tween', ease: 'anticipate', duration: 0.5 };

const CenteredSpinner = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

function PageLayout({ children }: { children: ReactNode }) {
  return (
    <Motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
      {children}
    </Motion.div>
  );
}

function PublicLayout({ children, mode, toggleMode }: { children: ReactNode; mode: 'light' | 'dark'; toggleMode: () => void }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header mode={mode} toggleMode={toggleMode} />
      {isHomePage ? children : (
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

function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <AdminHeader />
      <Container component="main" sx={{ py: 4, position: 'relative', zIndex: 1, flex: 1 }}>
        <PageLayout>{children}</PageLayout>
      </Container>
      <Footer />
    </Box>
  );
}

export default function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isAdminPage = location.pathname.startsWith('/admin');
  const isPublicNonHomePage = !isHomePage && !isAdminPage;

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

    // Menambahkan atau menghapus kelas background admin
    if (isAdminPage) {
      document.body.classList.add('admin-background');
    } else {
      document.body.classList.remove('admin-background');
    }
  }, [mode, isAdminPage]);

  useEffect(() => {
    if (isAdminPage) return;
    const trackPageView = async (path: string) => {
      try {
        await fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path }),
        });
      } catch (error) {
        console.error('Analytics tracking failed:', error);
      }
    };
    trackPageView(location.pathname);
  }, [location.pathname, isAdminPage]);

  const toggleMode = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {isHomePage && (
        <Suspense fallback={null}><Interactive3D /></Suspense>
      )}
      {isPublicNonHomePage && (
        <>
          <AnimatedBackground />
          <Suspense fallback={null}><InteractiveBackground /></Suspense>
        </>
      )}
      <AnimatePresence mode="wait">
        <Suspense fallback={<CenteredSpinner />}>
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
            <Route path="/admin/analytics" element={<PrivateRoute><AdminLayout><AdminAnalytics /></AdminLayout></PrivateRoute>} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </ThemeProvider>
  );
}