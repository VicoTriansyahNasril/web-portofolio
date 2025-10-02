// src/utils/url.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function fileUrl(u) {
    if (!u) {
        return '';
    }
    if (u.startsWith('http://') || u.startsWith('https://')) {
        return u;
    }
    if (u.startsWith('/')) {
        return `${API_BASE_URL}${u}`;
    }
    return u;
}