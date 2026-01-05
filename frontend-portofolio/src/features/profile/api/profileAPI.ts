import { api } from '@/lib/axios'
import { Profile } from '../types'

export const profileAPI = {
    getPublic: async (): Promise<Profile> => {
        const { data } = await api.get<Profile>('/api/profile')
        return data
    },
    updateAdmin: async (payload: Partial<Profile>): Promise<Profile> => {
        const { data } = await api.put<Profile>('/api/admin/profile', payload)
        return data
    }
}