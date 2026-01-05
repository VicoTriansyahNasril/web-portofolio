import { Box, Paper, Typography } from '@mui/material'
import LoginForm from '../components/LoginForm'

export default function LoginPage() {
    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default',
            p: 2
        }}>
            <Paper elevation={4} sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 3 }}>
                <Typography variant="h5" fontWeight={700} textAlign="center" mb={1}>
                    Admin Portal
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center" mb={4}>
                    Sign in to manage your portfolio
                </Typography>
                <LoginForm />
            </Paper>
        </Box>
    )
}