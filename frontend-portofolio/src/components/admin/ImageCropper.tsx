import { useState, useRef } from 'react'
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Area } from 'react-easy-crop'

interface ImageCropperProps {
    image: string
    onCropComplete: (croppedAreaPixels: Area) => void
    onCancel: () => void
    aspect?: number
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
    return centerCrop(
        makeAspectCrop({ unit: '%', width: 90 }, aspect, mediaWidth, mediaHeight),
        mediaWidth,
        mediaHeight
    )
}

export default function ImageCropper({ image, onCropComplete, onCancel, aspect: initialAspect }: ImageCropperProps) {
    const [crop, setCrop] = useState<Crop>()
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
    const [aspect, setAspect] = useState<number | undefined>(initialAspect)
    const imgRef = useRef<HTMLImageElement>(null)

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget
        if (aspect) {
            setCrop(centerAspectCrop(width, height, aspect))
        } else {
            setCrop(centerCrop({ unit: '%', width: 80, height: 80 }, width, height))
        }
    }

    const handleSave = () => {
        if (completedCrop && imgRef.current) {
            const image = imgRef.current
            const scaleX = image.naturalWidth / image.width
            const scaleY = image.naturalHeight / image.height

            const finalCrop: Area = {
                x: completedCrop.x * scaleX,
                y: completedCrop.y * scaleY,
                width: completedCrop.width * scaleX,
                height: completedCrop.height * scaleY
            }
            onCropComplete(finalCrop)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Crop Image</h3>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setAspect(undefined)}
                            className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${!aspect ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                        >
                            Free
                        </button>
                        <button
                            type="button"
                            onClick={() => setAspect(16 / 9)}
                            className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${aspect === 16 / 9 ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                        >
                            16:9
                        </button>
                        <button
                            type="button"
                            onClick={() => setAspect(4 / 3)}
                            className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${aspect === 4 / 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                        >
                            4:3
                        </button>
                        <button
                            type="button"
                            onClick={() => setAspect(1)}
                            className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${aspect === 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                        >
                            1:1
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-gray-900">
                    <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={aspect}
                        className="max-h-full"
                    >
                        <img
                            ref={imgRef}
                            alt="Crop me"
                            src={image}
                            onLoad={onImageLoad}
                            style={{ maxHeight: '60vh', maxWidth: '100%', objectFit: 'contain' }}
                        />
                    </ReactCrop>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-3 bg-white dark:bg-gray-800 rounded-b-xl">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="flex-1 px-4 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors shadow-lg shadow-primary-600/30"
                    >
                        Apply Crop
                    </button>
                </div>
            </div>
        </div>
    )
}