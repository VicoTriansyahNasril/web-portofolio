import { api } from './client'
import type { Achievement } from '../types'

export const fetchPublicAchievements = async (): Promise<Achievement[]> => {
    const { data } = await api.get<Achievement[]>('/api/achievements')
    return Array.isArray(data) ? data : []
}

export const fetchAdminAchievements = async (): Promise<Achievement[]> => {
    const { data } = await api.get<Achievement[]>('/api/admin/achievements')
    return Array.isArray(data) ? data : []
}

export const createAdminAchievement = async (payload: Partial<Achievement>): Promise<Achievement> => {
    const { data } = await api.post<Achievement>('/api/admin/achievements', payload)
    return data
}

export const updateAdminAchievement = async (id: number, payload: Partial<Achievement>): Promise<Achievement> => {
    const { data } = await api.put<Achievement>(`/api/admin/achievements/${id}`, payload)
    return data
}

export const deleteAdminAchievement = async (id: number): Promise<void> => {
    await api.delete(`/api/admin/achievements/${id}`)
}

export const reorderAdminAchievements = async (orders: Array<{ id: number; sort_order: number }>): Promise<any> => {
    const { data } = await api.post('/api/admin/achievements/reorder', { orders })
    return data
}