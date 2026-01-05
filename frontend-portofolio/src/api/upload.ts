import axios from 'axios'
import { api } from '@/lib/axios'

interface SignatureResponse {
    signature: string
    timestamp: number
    api_key: string
    folder: string
}

export const uploadFile = async (file: File): Promise<string> => {
    const { data: sig } = await api.get<SignatureResponse>('/api/admin/upload/signature')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('api_key', sig.api_key)
    formData.append('timestamp', String(sig.timestamp))
    formData.append('signature', sig.signature)
    formData.append('folder', sig.folder)

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

    const { data: uploadData } = await axios.post(cloudinaryUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })

    return uploadData.secure_url
}