import { api } from '@/lib/axios'
import { VisitorSummary, VisitorDetail } from '../types'

export const analyticsAPI = {
    getSummaries: async (): Promise<VisitorSummary[]> => {
        const { data } = await api.get<VisitorSummary[]>('/api/admin/analytics/visitors')
        return Array.isArray(data) ? data : []
    },
    getDetail: async (hash: string): Promise<VisitorDetail> => {
        const { data } = await api.get<VisitorDetail>(`/api/admin/analytics/visitors/${hash}`)
        return data
    }
}