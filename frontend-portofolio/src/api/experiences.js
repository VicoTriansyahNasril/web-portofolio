// src/api/experiences.js
import { api } from './client'

// --- PUBLIC ---
export const fetchPublicExperiences = async () => {
    const { data } = await api.get('/api/experiences')
    return Array.isArray(data) ? data : []
}

// --- ADMIN ---
export const fetchAdminExperiences = async () => {
    const { data } = await api.get('/api/admin/experiences')
    return Array.isArray(data) ? data : []
}

export const createAdminExperience = async (payload) => {
    const { data } = await api.post('/api/admin/experiences', payload)
    return data
}

export const updateAdminExperience = async (id, payload) => {
    const { data } = await api.put(`/api/admin/experiences/${id}`, payload)
    return data
}

export const deleteAdminExperience = async (id) => {
    await api.delete(`/api/admin/experiences/${id}`)
}