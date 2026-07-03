import { useState, FormEvent } from 'react'
import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { useAuth } from '../../auth/useAuth'
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [busy, setBusy] = useState<boolean>(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        setBusy(true)
        try {
            await login({ email, password })
            void navigate('/admin')
        } catch {
            setError('Login gagal. Periksa kembali email dan password Anda.')
        } finally {
            setBusy(false)
        }
    }

    return (
        <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
            <Paper sx={{ p: 3, width: 420, maxWidth: '90vw' }}>
                <Typography variant="h6" gutterBottom>Admin Login</Typography>
                <form onSubmit={(e) => void submit(e)}>
                    <Stack spacing={2}>
                        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        {error && <Typography color="error" variant="caption">{error}</Typography>}
                        <Button type="submit" variant="contained" disabled={busy}>
                            {busy ? 'Logging in...' : 'Login'}
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    )
}