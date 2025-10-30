import { useEffect, useCallback } from 'react'

interface LightboxProps {
    images: string[]
    isOpen: boolean
    currentIndex: number
    onClose: () => void
    onNavigate: (index: number) => void
}

export default function Lightbox({ images, isOpen, currentIndex, onClose, onNavigate }: LightboxProps) {
    const handlePrevious = useCallback(() => {
        onNavigate(currentIndex === 0 ? images.length - 1 : currentIndex - 1)
    }, [currentIndex, images.length, onNavigate])

    const handleNext = useCallback(() => {
        onNavigate(currentIndex === images.length - 1 ? 0 : currentIndex + 1)
    }, [currentIndex, images.length, onNavigate])

    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
            if (e.key === 'ArrowLeft') handlePrevious()
            if (e.key === 'ArrowRight') handleNext()
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, onClose, handlePrevious, handleNext])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <button
                onClick={handlePrevious}
                className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <button
                onClick={handleNext}
                className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            <div className="max-w-7xl max-h-[90vh] w-full mx-4">
                <img
                    src={images[currentIndex]}
                    alt={`Lightbox image ${currentIndex + 1}`}
                    className="w-full h-full object-contain"
                />
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium">
                {currentIndex + 1} / {images.length}
            </div>
        </div>
    )
}