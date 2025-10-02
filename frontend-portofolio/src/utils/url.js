//src/utils/url.js
export function fileUrl(u) {
    if (!u) return ''
    if (u.startsWith('http://') || u.startsWith('https://')) return u
    if (u.startsWith('/uploads/')) return `http://localhost:8080${u}`
    return u
}
