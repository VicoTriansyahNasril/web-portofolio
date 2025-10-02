//src/providers/ColorModeProvider.jsx
import { useEffect, useMemo, useState } from 'react'
import { ThemeProvider, CssBaseline, useMediaQuery } from '@mui/material'
import { getTheme } from '../theme'
import { ColorModeContext } from './colorMode'

export default function ColorModeProvider({ children }) {
    const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
    const [mode, setMode] = useState(() => localStorage.getItem('color-mode') || (prefersDark ? 'dark' : 'light'))

    useEffect(() => {
        const saved = localStorage.getItem('color-mode')
        if (!saved) setMode(prefersDark ? 'dark' : 'light')
    }, [prefersDark])

    useEffect(() => {
        localStorage.setItem('color-mode', mode)
        document.documentElement.setAttribute('data-color-mode', mode)
    }, [mode])

    const value = useMemo(() => ({
        mode,
        setMode,
        toggle: () => setMode(m => (m === 'light' ? 'dark' : 'light')),
    }), [mode])

    const theme = useMemo(() => getTheme(mode), [mode])

    return (
        <ColorModeContext.Provider value={value}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    )
}
