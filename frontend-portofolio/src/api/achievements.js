// src/api/achievements.js
import { api } from './client'

// --- PUBLIC ---
export const fetchPublicAchievements = async () => {
    const { data } = await api.get('/api/achievements')
    return Array.isArray(data) ? data : []
}

// --- ADMIN ---
export const fetchAdminAchievements = async () => {
    const { data } = await api.get('/api/admin/achievements')
    return Array.isArray(data) ? data : []
}

export const createAdminAchievement = async (payload) => {
    const { data } = await api.post('/api/admin/achievements', payload)
    return data
}

export const updateAdminAchievement = async (id, payload) => {
    const { data } = await api.put(`/api/admin/achievements/${id}`, payload)
    return data
}

export const deleteAdminAchievement = async (id) => {
    await api.delete(`/api/admin/achievements/${id}`)
}

export const reorderAdminAchievements = async (orders) => {
    const { data } = await api.post('/api/admin/achievements/reorder', { orders })
    return data
}