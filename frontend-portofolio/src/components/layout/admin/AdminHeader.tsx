import { AppBar, Toolbar, Button, Box,  useTheme, useMediaQuery } from '@mui/material'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/useAuth'
import { confirm } from '@/utils/confirm'

const navItems = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/projects', label: 'Projects' },
    { to: '/admin/profile', label: 'Profile' },
    { to: '/admin/skills', label: 'Skills' },
    { to: '/admin/experiences', label: 'Experiences' },
    { to: '/admin/achievements', label: 'Achievements' },
    { to: '/admin/analytics', label: 'Analytics' }
]

export default function AdminHeader() {
    const { logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    const handleLogout = async () => {
        const ok = await confirm({ title: 'Logout?', text: 'Are you sure you want to logout?', icon: 'warning', confirmText: 'Logout' })
        if (ok.isConfirmed) {
            void logout()
            navigate('/admin/login', { replace: true })
        }
    }

    return (
        <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', zIndex: (t) => t.zIndex.drawer + 1 }}>
            <Toolbar sx={{ minHeight: 70 }}>
                <Box sx={{ flex: 1, display: 'flex', gap: 1, overflowX: 'auto', pb: isMobile ? 1 : 0, alignItems: 'center' }}>
                    {navItems.map(item => (
                        <Button
                            key={item.to}
                            component={Link}
                            to={item.to}
                            variant={location.pathname === item.to ? 'contained' : 'text'}
                            size="small"
                            sx={{ whiteSpace: 'nowrap', borderRadius: 2, minWidth: 'auto' }}
                        >
                            {item.label}
                        </Button>
                    ))}
                </Box>
                <Button color="error" onClick={handleLogout} sx={{ fontWeight: 600, ml: 2 }}>
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    )
}