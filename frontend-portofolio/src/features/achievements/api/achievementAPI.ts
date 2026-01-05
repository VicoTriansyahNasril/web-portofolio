import { api } from '@/lib/axios'
import { Achievement, AchievementDTO } from '../types'

export const achievementAPI = {
    getAllPublic: async (): Promise<Achievement[]> => {
        const { data } = await api.get<Achievement[]>('/api/achievements')
        return Array.isArray(data) ? data : []
    },
    getAllAdmin: async (): Promise<Achievement[]> => {
        const { data } = await api.get<Achievement[]>('/api/admin/achievements')
        return Array.isArray(data) ? data : []
    },
    create: async (payload: Partial<AchievementDTO>): Promise<Achievement> => {
        const { data } = await api.post<Achievement>('/api/admin/achievements', payload)
        return data
    },
    update: async (id: number, payload: Partial<AchievementDTO>): Promise<Achievement> => {
        const { data } = await api.put<Achievement>(`/api/admin/achievements/${id}`, payload)
        return data
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`/api/admin/achievements/${id}`)
    },
    reorder: async (orders: { id: number; sort_order: number }[]): Promise<void> => {
        await api.post('/api/admin/achievements/reorder', { orders })
    }
}