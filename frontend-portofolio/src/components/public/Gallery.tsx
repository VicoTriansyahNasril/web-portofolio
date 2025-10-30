import { useState } from 'react'
import { fileUrl } from '../../utils/url'
import Lightbox from './Lightbox'

interface GalleryProps {
    images: string[]
}

export default function Gallery({ images }: GalleryProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)

    const openLightbox = (index: number) => {
        setCurrentIndex(index)
        setLightboxOpen(true)
    }

    if (!images || images.length === 0) {
        return null
    }

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => openLightbox(index)}
                        className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <img
                            src={fileUrl(image)}
                            alt={`Gallery image ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>

            <Lightbox
                images={images.map(fileUrl)}
                isOpen={lightboxOpen}
                currentIndex={currentIndex}
                onClose={() => setLightboxOpen(false)}
                onNavigate={setCurrentIndex}
            />
        </>
    )
}