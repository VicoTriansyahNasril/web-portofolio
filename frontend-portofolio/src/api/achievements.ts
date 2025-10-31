import { api } from './client'
import type { Achievement } from '../types'

export const fetchPublicAchievements = async (): Promise<Achievement[]> => {
    try {
        const { data } = await api.get<Achievement[]>('/api/achievements')
        return Array.isArray(data) ? data : []
    } catch (error) {
        console.error('Error fetching public achievements:', error)
        return []
    }
}

export const fetchAdminAchievements = async (): Promise<Achievement[]> => {
    try {
        const { data } = await api.get<Achievement[]>('/api/admin/achievements')
        return Array.isArray(data) ? data : []
    } catch (error) {
        console.error('Error fetching admin achievements:', error)
        throw error
    }
}

export const createAdminAchievement = async (payload: Partial<Achievement>): Promise<Achievement> => {
    try {
        const cleanPayload = {
            title: payload.title,
            issuer: payload.issuer,
            date: payload.date,
            description: payload.description || '',
            credential_url: payload.credential_url || '',
            link_text: payload.link_text || 'View Credential',
        }
        const { data } = await api.post<Achievement>('/api/admin/achievements', cleanPayload)
        return data
    } catch (error) {
        console.error('Error creating achievement:', error)
        throw error
    }
}

export const updateAdminAchievement = async (id: number, payload: Partial<Achievement>): Promise<Achievement> => {
    try {
        const cleanPayload = {
            title: payload.title,
            issuer: payload.issuer,
            date: payload.date,
            description: payload.description || '',
            credential_url: payload.credential_url || '',
            link_text: payload.link_text || 'View Credential',
        }
        const { data } = await api.put<Achievement>(`/api/admin/achievements/${id}`, cleanPayload)
        return data
    } catch (error) {
        console.error('Error updating achievement:', error)
        throw error
    }
}

export const deleteAdminAchievement = async (id: number): Promise<void> => {
    try {
        await api.delete(`/api/admin/achievements/${id}`)
    } catch (error) {
        console.error('Error deleting achievement:', error)
        throw error
    }
}

export const reorderAdminAchievements = async (orders: Array<{ id: number; sort_order: number }>): Promise<void> => {
    try {
        await api.post('/api/admin/achievements/reorder', { orders })
    } catch (error) {
        console.error('Error reordering achievements:', error)
        throw error
    }
}