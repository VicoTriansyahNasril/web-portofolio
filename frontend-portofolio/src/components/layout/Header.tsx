import { useState, useEffect } from 'react'
import { AppBar, Toolbar, Button, IconButton, Box } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'

interface HeaderProps {
    mode: 'light' | 'dark'
    toggleMode: () => void
}

export default function Header({ mode, toggleMode }: HeaderProps) {
    const location = useLocation()
    const navigate = useNavigate()
    const isHomePage = location.pathname === '/'
    const [activeSection, setActiveSection] = useState('home')

    useEffect(() => {
        if (!isHomePage) {
            setActiveSection('')
            return
        }

        const handleScroll = () => {
            const sections = ['home', 'projects', 'about']
            const scrollPosition = window.scrollY + 100

            for (const section of sections) {
                const element = document.getElementById(section)
                if (element) {
                    const offsetTop = element.offsetTop
                    const offsetHeight = element.offsetHeight
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section)
                    }
                }
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [isHomePage])

    const handleNavigation = (sectionId: string) => {
        if (isHomePage) {
            const element = document.getElementById(sectionId)
            if (element) {
                const headerOffset = 80
                const elementPosition = element.getBoundingClientRect().top
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                })
            }
        } else {
            navigate('/', { state: { scrollTo: sectionId } })
        }
    }

    const getButtonStyle = (section: string) => ({
        fontWeight: 600,
        textTransform: 'none' as const,
        color: activeSection === section ? 'primary.main' : 'text.primary',
        position: 'relative' as const,
        '&::after': activeSection === section ? {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '20px',
            height: '3px',
            borderRadius: '2px',
            backgroundColor: 'currentColor'
        } : {}
    })

    return (
        <AppBar
            position="sticky"
            color="transparent"
            elevation={0}
            sx={{
                backdropFilter: 'blur(12px)',
                background: (t) => t.palette.mode === 'dark' ? 'rgba(13,17,28,.8)' : 'rgba(255,255,255,.8)',
                borderBottom: (t) => `1px solid ${t.palette.divider}`,
                zIndex: (t) => t.zIndex.drawer + 1,
            }}
        >
            <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button onClick={() => handleNavigation('home')} sx={getButtonStyle('home')}>
                        Home
                    </Button>
                    <Button onClick={() => handleNavigation('projects')} sx={getButtonStyle('projects')}>
                        Projects
                    </Button>
                    <Button onClick={() => handleNavigation('about')} sx={getButtonStyle('about')}>
                        About
                    </Button>
                    <IconButton onClick={toggleMode} color="inherit">
                        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    )
}