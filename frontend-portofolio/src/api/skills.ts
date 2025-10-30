import { api } from './client'
import type { Skill } from '../types'

export const fetchPublicSkills = async (): Promise<Skill[]> => {
    const { data } = await api.get<Skill[]>('/api/skills')
    return Array.isArray(data) ? data : []
}

export const fetchAdminSkills = async (): Promise<Skill[]> => {
    const { data } = await api.get<Skill[]>('/api/admin/skills')
    return Array.isArray(data) ? data : []
}

export const createAdminSkill = async (payload: Partial<Skill>): Promise<Skill> => {
    const { data } = await api.post<Skill>('/api/admin/skills', payload)
    return data
}

export const updateAdminSkill = async (id: number, payload: Partial<Skill>): Promise<Skill> => {
    const { data } = await api.put<Skill>(`/api/admin/skills/${id}`, payload)
    return data
}

export const deleteAdminSkill = async (id: number): Promise<void> => {
    await api.delete(`/api/admin/skills/${id}`)
}

export const reorderAdminSkills = async (orders: Array<{ id: number; order_index: number }>): Promise<any> => {
    const { data } = await api.post('/api/admin/skills/reorder', { orders })
    return data
}