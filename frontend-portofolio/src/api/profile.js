// src/api/profile.js
import { api } from './client'

// --- PUBLIC ---
export const fetchPublicProfile = async () => {
    const { data } = await api.get('/api/profile')
    if (data && typeof data === 'object' && data.profile === null) return null
    return data
}

export const fetchPublicSkills = async () => {
    const { data } = await api.get('/api/skills')
    return Array.isArray(data) ? data : []
}

// --- ADMIN ---
export const fetchAdminProfile = async () => {
    const { data } = await api.get('/api/profile')
    return data
}

export const upsertAdminProfile = async (payload) => {
    const { data } = await api.put('/api/admin/profile', payload)
    return data
}