import { api } from '@/lib/axios'
import { Experience, ExperienceDTO } from '../types'

export const experienceAPI = {
    getAllPublic: async (): Promise<Experience[]> => {
        const { data } = await api.get<Experience[]>('/api/experiences')
        return Array.isArray(data) ? data : []
    },
    getAllAdmin: async (): Promise<Experience[]> => {
        const { data } = await api.get<Experience[]>('/api/admin/experiences')
        return Array.isArray(data) ? data : []
    },
    create: async (payload: Partial<ExperienceDTO>): Promise<Experience> => {
        const { data } = await api.post<Experience>('/api/admin/experiences', payload)
        return data
    },
    update: async (id: number, payload: Partial<ExperienceDTO>): Promise<Experience> => {
        const { data } = await api.put<Experience>(`/api/admin/experiences/${id}`, payload)
        return data
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`/api/admin/experiences/${id}`)
    }
}