export interface LoginCredentials {
    email: string
    password: string
}

export interface LoginResponse {
    access_token: string
}

export interface AuthContextType {
    token: string | null
    isAuthenticated: boolean
    login: (credentials: LoginCredentials) => Promise<void>
    logout: () => void
}