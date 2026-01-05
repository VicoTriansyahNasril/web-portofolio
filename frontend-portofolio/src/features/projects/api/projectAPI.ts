import { api } from '@/lib/axios'
import { Project, CreateProjectDTO, UpdateProjectDTO } from '../types'

export const projectAPI = {
    getAllPublic: async (): Promise<Project[]> => {
        const { data } = await api.get<Project[]>('/api/projects')
        return Array.isArray(data) ? data : []
    },

    getBySlug: async (slug: string): Promise<Project | null> => {
        const { data } = await api.get<Project>(`/api/projects/${slug}`)
        return data || null
    },

    getAllAdmin: async (): Promise<Project[]> => {
        const { data } = await api.get<Project[]>('/api/admin/projects')
        return Array.isArray(data) ? data : []
    },

    getByIdAdmin: async (id: number): Promise<Project | null> => {
        const { data } = await api.get<Project>(`/api/admin/projects/${id}`)
        return data || null
    },

    create: async (payload: Partial<CreateProjectDTO>): Promise<Project> => {
        const { data } = await api.post<Project>('/api/admin/projects', payload)
        return data
    },

    update: async (id: number, payload: UpdateProjectDTO): Promise<Project> => {
        const { data } = await api.put<Project>(`/api/admin/projects/${id}`, payload)
        return data
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/api/admin/projects/${id}`)
    },

    reorder: async (orders: { id: number; sort_order: number }[]): Promise<void> => {
        await api.post('/api/admin/projects/reorder', { orders })
    }
}