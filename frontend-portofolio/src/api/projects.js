// src/api/projects.js (punyamu sudah benar)
import { api } from './client'

export async function getProjectsPublic() {
    const { data } = await api.get('/api/projects')
    return data
}
export async function getProjectBySlug(slug) {
    const { data } = await api.get(`/api/projects/${slug}`)
    return data
}
export async function getProjectsAdmin() {
    const { data } = await api.get('/api/admin/projects')
    return data
}
export async function getProjectAdminById(id) {
    const { data } = await api.get(`/api/admin/projects/${id}`)
    return data
}
export async function createProject(payload) {
    const { data } = await api.post('/api/admin/projects', payload)
    return data
}
export async function updateProject(id, payload) {
    const { data } = await api.put(`/api/admin/projects/${id}`, payload)
    return data
}
export async function deleteProject(id) {
    await api.delete(`/api/admin/projects/${id}`)
}

// tetap: kirim { orders: [{id, sort_order}] }, fallback per item
export async function reorderProjects(orders) {
    try {
        const { data } = await api.put('/api/admin/projects/reorder', { orders })
        return data
    } catch {
        for (const o of orders) {
            await api.put(`/api/admin/projects/${o.id}`, { sort_order: o.sort_order })
        }
        return { ok: true }
    }
}
