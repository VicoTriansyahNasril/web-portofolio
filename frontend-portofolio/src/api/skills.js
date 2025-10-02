// src/api/skills.js
import { api } from './client'

export const fetchAdminSkills = async () => {
    const { data } = await api.get('/api/admin/skills')
    return Array.isArray(data) ? data : []
}

export const createAdminSkill = async (payload) => {
    const { data } = await api.post('/api/admin/skills', payload)
    return data
}

export const updateAdminSkill = async (id, payload) => {
    const { data } = await api.put(`/api/admin/skills/${id}`, payload)
    return data
}

export const deleteAdminSkill = async (id) => {
    await api.delete(`/api/admin/skills/${id}`)
}

export const reorderAdminSkills = async (orders) => {
    const { data } = await api.post('/api/admin/skills/reorder', { orders })
    return data
}