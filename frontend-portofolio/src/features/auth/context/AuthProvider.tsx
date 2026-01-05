import { useState, useEffect, ReactNode, useCallback } from 'react'
import { AuthContext } from './AuthContext'
import { authAPI } from '../api/authAPI'
import { LoginCredentials } from '../types'

interface AuthProviderProps {
    children: ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('admin-token'))

    useEffect(() => {
        if (token) {
            localStorage.setItem('admin-token', token)
        } else {
            localStorage.removeItem('admin-token')
        }
    }, [token])

    const login = useCallback(async (credentials: LoginCredentials) => {
        const data = await authAPI.login(credentials)
        if (data.access_token) {
            setToken(data.access_token)
        } else {
            throw new Error('No access token received')
        }
    }, [])

    const logout = useCallback(() => {
        setToken(null)
    }, [])

    return (
        <AuthContext.Provider value={{
            token,
            isAuthenticated: !!token,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}