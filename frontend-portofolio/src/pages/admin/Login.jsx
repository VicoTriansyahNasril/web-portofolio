/* eslint-disable no-unused-vars */
//src/pages/admin/Login.jsx
import { useState } from 'react'
import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { useAuth } from '../../auth/useAuth'
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [busy, setBusy] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const submit = async (e) => {
        e.preventDefault()
        setError('')
        setBusy(true)
        try {
            await login({ email, password })
            navigate('/admin')
        } catch (err) {
            setError('Login gagal')
        } finally {
            setBusy(false)
        }
    }

    return (
        <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
            <Paper sx={{ p: 3, width: 420, maxWidth: '90vw' }}>
                <Typography variant="h6" gutterBottom>Admin Login</Typography>
                <form onSubmit={submit}>
                    <Stack spacing={2}>
                        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        {error && <Typography color="error" variant="caption">{error}</Typography>}
                        <Button type="submit" variant="contained" disabled={busy}>Login</Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    )
}