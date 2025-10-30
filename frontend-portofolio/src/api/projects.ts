import { api } from './client'
import type { Project } from '../types'

export const fetchPublicProjects = async (): Promise<Project[]> => {
    const { data } = await api.get<Project[]>('/api/projects')
    return Array.isArray(data) ? data : []
}

export const fetchPublicProjectBySlug = async (slug: string): Promise<Project | null> => {
    const { data } = await api.get<Project>(`/api/projects/${slug}`)
    return data || null
}

export const fetchAdminProjects = async (): Promise<Project[]> => {
    const { data } = await api.get<Project[]>('/api/admin/projects')
    return Array.isArray(data) ? data : []
}

export const fetchAdminProjectById = async (id: number): Promise<Project | null> => {
    const { data } = await api.get<Project>(`/api/admin/projects/${id}`)
    return data || null
}

export const createAdminProject = async (payload: Partial<Project>): Promise<Project> => {
    const { data } = await api.post<Project>('/api/admin/projects', payload)
    return data
}

export const updateAdminProject = async (id: number, payload: Partial<Project>): Promise<Project> => {
    const { data } = await api.put<Project>(`/api/admin/projects/${id}`, payload)
    return data
}

export const deleteAdminProject = async (id: number): Promise<void> => {
    await api.delete(`/api/admin/projects/${id}`)
}

export const reorderAdminProjects = async (orders: { id: number; sort_order: number }[]): Promise<any> => {
    const { data } = await api.post('/api/admin/projects/reorder', { orders });
    return data;
};