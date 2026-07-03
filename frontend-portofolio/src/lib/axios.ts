import axios, { InternalAxiosRequestConfig } from 'axios'

export const api = axios.create({
    baseURL: '/',
    headers: {
        'Content-Type': 'application/json',
    },
	withCredentials: true, // Allow cookies to be sent with requests
})

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // CSRF Protection Header
        if (config.headers) {
            config.headers['X-Requested-With'] = 'XMLHttpRequest'
        }
        return config
    },
    (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/admin/login'
            }
        }
        return Promise.reject(error)
    }
)

const VISITOR_ID_KEY = 'portfolio_visitor_id'

function getVisitorId(): string {
    let visitorId = localStorage.getItem(VISITOR_ID_KEY)
    if (!visitorId) {
        visitorId = crypto.randomUUID()
        localStorage.setItem(VISITOR_ID_KEY, visitorId)
    }
    return visitorId
}

export const trackPageVisit = async (path: string): Promise<void> => {
    try {
        const visitorId = getVisitorId()
        await api.post('/api/track', { path, visitorId })
    } catch (error) {
        console.error('Failed to track page visit:', error)
    }
}