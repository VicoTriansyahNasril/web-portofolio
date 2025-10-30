import { useEffect, useState, ReactNode } from 'react'
import { AuthContext } from './authContext'
import { api } from '../api/client'

interface AuthProviderProps {
    children: ReactNode
}

interface LoginCredentials {
    email: string
    password: string
}

interface LoginResponse {
    access_token?: string
    token?: string
    jwt?: string
    data?: {
        access_token?: string
    }
}

export default function AuthProvider({ children }: AuthProviderProps) {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('admin-token'))

    useEffect(() => {
        if (token) localStorage.setItem('admin-token', token)
        else localStorage.removeItem('admin-token')
    }, [token])

    const login = async ({ email, password }: LoginCredentials): Promise<boolean> => {
        const { data } = await api.post<LoginResponse>('/api/auth/login', { email, password })
        const t = data?.access_token || data?.token || data?.jwt || data?.data?.access_token
        if (!t) throw new Error('Token tidak ditemukan pada respons login')
        setToken(t)
        return true
    }

    const logout = () => setToken(null)

    return <AuthContext.Provider value={{ token, login, logout }}>{children}</AuthContext.Provider>
}