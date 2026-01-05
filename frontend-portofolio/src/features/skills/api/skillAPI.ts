import { api } from '@/lib/axios'
import { Skill, SkillCreateDTO } from '../types'

export const skillAPI = {
    getAllPublic: async (): Promise<Skill[]> => {
        const { data } = await api.get<Skill[]>('/api/skills')
        return Array.isArray(data) ? data : []
    },
    getAllAdmin: async (): Promise<Skill[]> => {
        const { data } = await api.get<Skill[]>('/api/admin/skills')
        return Array.isArray(data) ? data : []
    },
    create: async (payload: SkillCreateDTO): Promise<Skill> => {
        const { data } = await api.post<Skill>('/api/admin/skills', payload)
        return data
    },
    update: async (id: number, payload: SkillCreateDTO): Promise<Skill> => {
        const { data } = await api.put<Skill>(`/api/admin/skills/${id}`, payload)
        return data
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`/api/admin/skills/${id}`)
    },
    reorder: async (orders: { id: number; sort_order: number }[]): Promise<void> => {
        await api.post('/api/admin/skills/reorder', { orders })
    }
}