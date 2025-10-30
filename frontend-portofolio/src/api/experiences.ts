import { api } from './client'
import type { Experience } from '../types'

export const fetchPublicExperiences = async (): Promise<Experience[]> => {
    const { data } = await api.get<Experience[]>('/api/experiences')
    return Array.isArray(data) ? data : []
}

export const fetchAdminExperiences = async (): Promise<Experience[]> => {
    const { data } = await api.get<Experience[]>('/api/admin/experiences')
    return Array.isArray(data) ? data : []
}

export const createAdminExperience = async (payload: Partial<Experience>): Promise<Experience> => {
    const { data } = await api.post<Experience>('/api/admin/experiences', payload)
    return data
}

export const updateAdminExperience = async (id: number, payload: Partial<Experience>): Promise<Experience> => {
    const { data } = await api.put<Experience>(`/api/admin/experiences/${id}`, payload)
    return data
}

export const deleteAdminExperience = async (id: number): Promise<void> => {
    await api.delete(`/api/admin/experiences/${id}`)
}