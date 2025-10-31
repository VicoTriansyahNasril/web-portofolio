import axios, { AxiosResponse } from 'axios';

const instance = axios.create({});

const VISITOR_ID_KEY = 'portfolio_visitor_id';

function getVisitorId(): string {
    let visitorId = localStorage.getItem(VISITOR_ID_KEY);
    if (!visitorId) {
        visitorId = crypto.randomUUID();
        localStorage.setItem(VISITOR_ID_KEY, visitorId);
    }
    return visitorId;
}

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('admin-token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (config.url && !config.url.startsWith('/api')) {
            config.url = `/api${config.url}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('admin-token');
            if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

export const api = {
    get: <T = any>(url: string): Promise<AxiosResponse<T>> => instance.get<T>(url),
    post: <T = any, D = any>(url: string, data?: D): Promise<AxiosResponse<T>> => instance.post<T>(url, data),
    put: <T = any, D = any>(url: string, data?: D): Promise<AxiosResponse<T>> => instance.put<T>(url, data),
    delete: <T = any>(url: string): Promise<AxiosResponse<T>> => instance.delete<T>(url),
    patch: <T = any, D = any>(url: string, data?: D): Promise<AxiosResponse<T>> => instance.patch<T>(url, data),
};

export const trackPageVisit = async (path: string): Promise<void> => {
    try {
        const visitorId = getVisitorId();
        await api.post('/api/track', { path, visitorId });
    } catch (error) {
        console.error('Failed to track page visit:', error);
    }
};