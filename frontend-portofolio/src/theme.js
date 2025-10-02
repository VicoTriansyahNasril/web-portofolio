/* eslint-disable no-unused-vars */
//src/theme.js
import { createTheme, alpha } from '@mui/material/styles'

export const getTheme = (mode = 'dark') =>
    createTheme({
        palette: {
            mode,
            primary: { main: '#7C3AED' },
            secondary: { main: '#06B6D4' },
            ...(mode === 'light'
                ? {
                    background: {
                        default: '#EEF2F6',
                        paper: 'rgba(247, 249, 252, 0.7)',
                    },
                    text: { primary: '#0F172A', secondary: '#475569' },
                    divider: 'rgba(15,23,42,.08)',
                }
                : {
                    background: { default: '#0B1020', paper: 'rgba(17, 22, 42, 0.6)' },
                    text: { primary: '#E8ECF5', secondary: '#B8C0D9' },
                    divider: 'rgba(255,255,255,.1)',
                }),
            success: { main: '#10B981' },
            error: { main: '#EF4444' },
            warning: { main: '#F59E0B' },
            info: { main: '#3B82F6' },
        },
        shape: { borderRadius: 16 },
        typography: {
            fontFamily: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'Arial'].join(','),
            h1: { fontWeight: 800, letterSpacing: '-0.02em', fontSize: '2.4rem' },
            h2: { fontWeight: 700, letterSpacing: '-0.02em', fontSize: '2rem' },
            h3: { fontWeight: 700, fontSize: '1.6rem' },
            button: { fontWeight: 600, letterSpacing: '.01em', textTransform: 'none' },
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: (t) => ({ body: { backgroundColor: t.palette.background.default } }),
            },
            MuiAppBar: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                        background: 'transparent',
                        borderBottom: `1px solid ${theme.palette.divider}`,
                    }),
                },
            },
            MuiPaper: {
                defaultProps: { elevation: 0 },
                styleOverrides: {
                    root: ({ theme }) => ({
                        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(17, 22, 42, 0.6)' : 'rgba(247, 249, 252, 0.7)',
                        border: `1px solid ${theme.palette.divider}`,
                    }),
                },
            },
            MuiCard: { // Kartu proyek akan mewarisi style Paper, jadi kita fokus ke hover
                styleOverrides: {
                    root: {
                        backgroundColor: 'transparent',
                        // Hover effect sekarang ditangani oleh Framer Motion di komponen Home
                    },
                },
            },
            MuiButton: {
                defaultProps: { disableElevation: true },
                styleOverrides: {
                    root: {
                        borderRadius: 10, paddingInline: 16,
                        transition: 'transform .15s ease, box-shadow .2s ease',
                        '&:active': { transform: 'translateY(1px)' },
                    },
                    containedPrimary: { color: '#fff' },
                },
            },
            MuiContainer: {
                styleOverrides: { root: { '@media (max-width:600px)': { paddingInline: 12 } } },
            },
        },
    })