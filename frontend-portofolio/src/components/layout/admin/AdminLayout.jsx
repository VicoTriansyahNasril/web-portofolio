//src/components/layout/admin/AdminLayout.jsx
import { Container, Box } from '@mui/material'
import AdminHeader from './AdminHeader'
import Footer from '../Footer'

export default function AdminLayout({ children }) {
    return (
        <Box display="flex" minHeight="100vh" flexDirection="column">
            <AdminHeader />
            <Container component="main" sx={{ flex: 1, py: 4 }}>
                {children}
            </Container>
            <Footer />
        </Box>
    )
}
