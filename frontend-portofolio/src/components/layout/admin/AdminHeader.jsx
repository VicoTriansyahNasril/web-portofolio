// src/components/layout/admin/AdminHeader.jsx
import { AppBar, Toolbar, Button, Box, Stack } from '@mui/material'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../auth/useAuth'
import { confirm } from '../../../utils/confirm'

const nav = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/projects', label: 'Projects' },
    { to: '/admin/profile', label: 'Profile' },
    { to: '/admin/skills', label: 'Skills' },
    { to: '/admin/experiences', label: 'Experiences' },
    { to: '/admin/achievements', label: 'Achievements' },
]

export default function AdminHeader() {
    const { logout } = useAuth()
    const navigate = useNavigate()
    const { pathname } = useLocation()

    const onLogout = async () => {
        const ok = await confirm({ title: 'Logout?', text: 'Anda yakin ingin keluar?', icon: 'warning', confirmText: 'Logout' })
        if (ok.isConfirmed) {
            logout()
            navigate('/admin/login', { replace: true })
        }
    }

    return (
        <AppBar position="sticky" color="inherit" sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
            <Toolbar sx={{ minHeight: 72 }}>
                <Box sx={{ flex: 1 }} />
                <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="flex-end">
                    {nav.map(n => (
                        <Button
                            key={n.to}
                            component={Link}
                            to={n.to}
                            variant={pathname === n.to ? 'contained' : 'text'}
                        >
                            {n.label}
                        </Button>
                    ))}
                    <Button color="error" onClick={onLogout}>Logout</Button>
                </Stack>
            </Toolbar>
        </AppBar>
    )
}