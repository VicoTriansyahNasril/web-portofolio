export interface LoginCredentials {
    email: string
    password: string
}

export interface LoginResponse {
    message: string
}

export interface AuthContextType {
    token: string | null
    isAuthenticated: boolean
    login: (credentials: LoginCredentials) => Promise<void>
    logout: () => void
}