import { createContext } from 'react'

interface AuthContextType {
    token: string | null
    login: (credentials: { email: string; password: string }) => Promise<boolean>
    logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
    token: null,
    login: async () => false,
    logout: () => { },
})