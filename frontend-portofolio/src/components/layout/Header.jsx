// src/components/layout/Header.jsx
import { AppBar, Toolbar, Button, IconButton, Box } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'

export default function Header({ mode, toggleMode }) {
    const location = useLocation()
    const isActive = (path) =>
        path === '/'
            ? location.pathname === '/'
            : location.pathname === path || location.pathname.startsWith(path + '/')

    return (
        <AppBar
            position="sticky"
            color="transparent"
            elevation={0}
            sx={{
                backdropFilter: 'blur(12px)',
                background: (t) =>
                    t.palette.mode === 'dark' ? 'rgba(13,17,28,.5)' : 'rgba(255,255,255,.7)',
                borderBottom: (t) => `1px solid ${t.palette.divider}`,
                zIndex: (t) => t.zIndex.drawer + 1,
            }}
        >
            <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                        component={Link}
                        to="/"
                        sx={{
                            fontWeight: 600,
                            color: (t) => (isActive('/') ? t.palette.primary.main : t.palette.text.primary),
                            textTransform: 'none',
                        }}
                    >
                        Home
                    </Button>
                    <Button
                        component={Link}
                        to="/projects"
                        sx={{
                            fontWeight: 600,
                            color: (t) => (isActive('/projects') ? t.palette.primary.main : t.palette.text.primary),
                            textTransform: 'none',
                        }}
                    >
                        Projects
                    </Button>
                    <Button
                        component={Link}
                        to="/about"
                        sx={{
                            fontWeight: 600,
                            color: (t) => (isActive('/about') ? t.palette.primary.main : t.palette.text.primary),
                            textTransform: 'none',
                        }}
                    >
                        About
                    </Button>
                    <IconButton onClick={toggleMode}>
                        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    )
}