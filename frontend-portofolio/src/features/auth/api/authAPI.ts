import { api } from '@/lib/axios'
import { LoginCredentials, LoginResponse } from '../types'

export const authAPI = {
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const { data } = await api.post<LoginResponse>('/api/auth/login', credentials)
        return data
    }
}