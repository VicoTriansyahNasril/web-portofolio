import { useEffect, useState, ReactNode } from 'react'
import { AuthContext } from './authContext'
import { api } from '@/lib/axios'

interface AuthProviderProps {
    children: ReactNode
}

interface LoginCredentials {
    email: string
    password: string
}

interface LoginResponse {
    message?: string
}

export default function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => localStorage.getItem('is-auth') === 'true')

    useEffect(() => {
        if (isAuthenticated) localStorage.setItem('is-auth', 'true')
        else localStorage.removeItem('is-auth')
    }, [isAuthenticated])

    const login = async ({ email, password }: LoginCredentials): Promise<boolean> => {
        await api.post<LoginResponse>('/api/auth/login', { email, password })
        setIsAuthenticated(true)
        return true
    }

    const logout = async () => {
        try {
            await api.post('/api/auth/logout')
        } catch (e) {
            console.error('Logout failed', e)
        }
        setIsAuthenticated(false)
    }

    // Map isAuthenticated to token to avoid breaking contexts that check `if (token)`
    const token = isAuthenticated ? "active" : null

    return <AuthContext.Provider value={{ token, login, logout }}>{children}</AuthContext.Provider>
}