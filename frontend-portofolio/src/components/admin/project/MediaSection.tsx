import { ChangeEvent, useRef, useState } from 'react'
import { Area } from 'react-easy-crop'
import GalleryManager from '../GalleryManager'
import ImageCropper from '../ImageCropper'
import { uploadFile } from '../../../api/upload'
import { getCroppedImg, createImage } from '../../../utils/canvasUtils'
import { CircularProgress } from '@mui/material'

interface MediaSectionProps {
    formData: any
    gallery: string[]
    onCoverChange: (url: string) => void
    onGalleryChange: (newGallery: string[]) => void
    onGalleryUpload: (files: FileList | null) => void
    onInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export default function MediaSection({
    formData, gallery, onCoverChange, onGalleryChange, onGalleryUpload, onInputChange
}: MediaSectionProps) {
    const fileRef = useRef<HTMLInputElement>(null)
    const coverInputRef = useRef<HTMLInputElement>(null)

    const [cropImage, setCropImage] = useState<string | null>(null)
    const [isCropping, setIsCropping] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [targetType, setTargetType] = useState<'cover' | 'gallery'>('cover')
    const [galleryEditIndex, setGalleryEditIndex] = useState<number>(-1)

    const handleCoverSelect = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            const reader = new FileReader()
            reader.addEventListener('load', () => {
                setCropImage(reader.result as string)
                setTargetType('cover')
                setIsCropping(true)
            })
            reader.readAsDataURL(file)
        }
        e.target.value = ''
    }

    const handleGalleryEdit = async (id: string) => {
        const index = gallery.findIndex(url => url === id)
        if (index === -1) return

        try {
            const img = await createImage(id)
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')
            ctx?.drawImage(img, 0, 0)

            setCropImage(canvas.toDataURL('image/jpeg'))
            setTargetType('gallery')
            setGalleryEditIndex(index)
            setIsCropping(true)
        } catch (error) {
            console.error('Failed to load image for editing', error)
            alert('Gagal memuat gambar untuk diedit (CORS/Network error).')
        }
    }

    const handleCropComplete = async (croppedAreaPixels: Area) => {
        if (!cropImage) return

        try {
            setUploading(true)
            setIsCropping(false)

            const croppedFile = await getCroppedImg(cropImage, croppedAreaPixels, 'cropped-image.jpg')
            const url = await uploadFile(croppedFile)

            if (targetType === 'cover') {
                onCoverChange(url)
            } else {
                const newGallery = [...gallery]
                if (galleryEditIndex !== -1) {
                    newGallery[galleryEditIndex] = url
                    onGalleryChange(newGallery)
                }
            }
        } catch (error) {
            console.error('Failed to crop/upload', error)
            alert('Gagal memproses gambar.')
        } finally {
            setUploading(false)
            setCropImage(null)
            setGalleryEditIndex(-1)
        }
    }

    return (
        <section className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Media & Content
            </h3>

            <div>
                <label className="block text-sm font-semibold mb-2">Cover Image</label>
                <div className="flex gap-4">
                    <input
                        name="coverUrl"
                        value={formData.coverUrl}
                        onChange={onInputChange}
                        className="form-input flex-1"
                        placeholder="https://..."
                    />
                    <input type="file" accept="image/*" hidden ref={coverInputRef} onChange={handleCoverSelect} />
                    <button
                        type="button"
                        onClick={() => coverInputRef.current?.click()}
                        disabled={uploading}
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {uploading && targetType === 'cover' ? <CircularProgress size={20} color="inherit" /> : 'Upload & Crop'}
                    </button>
                </div>
                {formData.coverUrl && (
                    <div className="mt-4 relative w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group">
                        <img src={formData.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => onCoverChange('')} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                )}
            </div>

            <div>
                <label className="block text-sm font-semibold mb-2">Gallery Images</label>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <input type="file" multiple accept="image/*" hidden ref={fileRef} onChange={(e) => onGalleryUpload(e.target.files)} />
                    {uploading && targetType === 'gallery' && (
                        <div className="mb-4 text-center text-sm text-primary-600 animate-pulse">Processing cropped image...</div>
                    )}
                    <GalleryManager
                        images={gallery.map(url => ({ id: url, url }))}
                        onReorder={(newImages) => onGalleryChange(newImages.map(img => img.url))}
                        onDelete={(id) => onGalleryChange(gallery.filter(url => url !== id))}
                        onEdit={handleGalleryEdit}
                        onAdd={() => fileRef.current?.click()}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold mb-2">Content Body (Markdown) <span className="text-red-500">*</span></label>
                <textarea name="body" value={formData.body} onChange={onInputChange} required rows={15} className="form-textarea font-mono text-sm" />
            </div>

            {isCropping && cropImage && (
                <ImageCropper
                    image={cropImage}
                    aspect={targetType === 'cover' ? 16 / 9 : undefined}
                    onCropComplete={handleCropComplete}
                    onCancel={() => { setIsCropping(false); setCropImage(null) }}
                />
            )}
        </section>
    )
}