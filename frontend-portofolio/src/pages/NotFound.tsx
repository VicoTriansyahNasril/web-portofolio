import { Box, Typography, Button, Container } from '@mui/material'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
    return (
        <Container>
            <Box sx={{
                minHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Typography variant="h1" sx={{
                        fontSize: { xs: '6rem', md: '10rem' },
                        fontWeight: 900,
                        background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        404
                    </Typography>
                </motion.div>

                <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                    Page Not Found
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </Typography>

                <Button component={Link} to="/" variant="contained" size="large">
                    Back to Home
                </Button>
            </Box>
        </Container>
    )
}