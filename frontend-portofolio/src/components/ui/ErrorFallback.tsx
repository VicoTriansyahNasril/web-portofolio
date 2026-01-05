import { Box, Typography, Button } from '@mui/material'

interface ErrorFallbackProps {
    error: Error
    resetErrorBoundary: () => void
}

export default function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
    return (
        <Box sx={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
            textAlign: 'center'
        }}>
            <Typography variant="h5" gutterBottom color="error.main" fontWeight={700}>
                Something went wrong
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
                {error.message}
            </Typography>
            <Button variant="outlined" onClick={resetErrorBoundary}>
                Try again
            </Button>
        </Box>
    )
}