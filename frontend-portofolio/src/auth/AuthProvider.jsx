//src/auth/AuthProvider.jsx
import { useEffect, useState } from 'react'
import { AuthContext } from './authContext'
import { api } from '../api/client'

export default function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('admin-token'))

    useEffect(() => {
        if (token) localStorage.setItem('admin-token', token)
        else localStorage.removeItem('admin-token')
    }, [token])

    const login = async ({ email, password }) => {
        const { data } = await api.post('/api/auth/login', { email, password })
        const t = data?.access_token || data?.token || data?.jwt || data?.data?.access_token
        if (!t) throw new Error('Token tidak ditemukan pada respons login')
        setToken(t)
        return true
    }

    const logout = () => setToken(null)

    return <AuthContext.Provider value={{ token, login, logout }}>{children}</AuthContext.Provider>
}