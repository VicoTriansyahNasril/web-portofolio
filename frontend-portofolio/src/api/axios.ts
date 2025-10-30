import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

const instance = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token')
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error: AxiosError) => Promise.reject(error)
)

instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            if (window.location.pathname.startsWith('/admin') &&
                window.location.pathname !== '/admin/login') {
                window.location.href = '/admin/login'
            }
        }
        return Promise.reject(error)
    }
)

export default instance