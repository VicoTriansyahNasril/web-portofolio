//src/components/layout/Footer.jsx
import { Box, Container, Typography, Stack, Link } from '@mui/material'

export default function Footer() {
    return (
        <Box className="app-footer" component="footer" sx={{ py: 3, mt: 'auto' }}>
            <Container maxWidth="lg">
                <Stack direction="row" justifyContent="center" spacing={1} sx={{ color: 'text.secondary' }}>
                    <Typography variant="body2">© {new Date().getFullYear()} Vico Triansyah Nasril ·</Typography>
                    <Link href="https://github.com/VicoTriansyahNasril" target="_blank" variant="body2">GitHub</Link>
                    <Typography variant="body2">·</Typography>
                    <Link href="https://www.linkedin.com" target="_blank" variant="body2">LinkedIn</Link>
                </Stack>
            </Container>
        </Box>
    )
}
