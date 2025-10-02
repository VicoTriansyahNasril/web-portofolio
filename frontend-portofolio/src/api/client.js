//src/api/client.js
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
export const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
    const t = localStorage.getItem('admin-token')
    if (t) config.headers.Authorization = `Bearer ${t}`
    return config
})