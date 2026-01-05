import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { IconButton, Box, Stack, Tooltip } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'
import RestartAltIcon from '@mui/icons-material/RestartAlt'

interface LightboxProps {
    images: string[]
    isOpen: boolean
    currentIndex: number
    onClose: () => void
    onNavigate: (index: number) => void
}

export default function Lightbox({ images, isOpen, currentIndex, onClose, onNavigate }: LightboxProps) {
    const [scale, setScale] = useState(1)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const dragStart = useRef({ x: 0, y: 0 })

    const resetZoom = useCallback(() => {
        setScale(1)
        setPosition({ x: 0, y: 0 })
    }, [])

    useEffect(() => {
        if (isOpen) {
            resetZoom()
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [currentIndex, isOpen, resetZoom])

    const handleWheel = (e: React.WheelEvent) => {
        e.stopPropagation()
        const delta = e.deltaY * -0.001
        const newScale = Math.min(Math.max(1, scale + delta), 4)
        setScale(newScale)
        if (newScale === 1) setPosition({ x: 0, y: 0 })
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        if (scale > 1) {
            setIsDragging(true)
            dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y }
        }
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && scale > 1) {
            e.preventDefault()
            setPosition({
                x: e.clientX - dragStart.current.x,
                y: e.clientY - dragStart.current.y
            })
        }
    }

    const handleMouseUp = () => setIsDragging(false)

    const handleNavigate = (dir: 'prev' | 'next') => {
        const newIndex = dir === 'prev'
            ? (currentIndex === 0 ? images.length - 1 : currentIndex - 1)
            : (currentIndex === images.length - 1 ? 0 : currentIndex + 1)
        onNavigate(newIndex)
    }

    const buttonStyle = {
        color: 'white',
        bgcolor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' },
        width: 48,
        height: 48,
    }

    if (!isOpen && typeof document === 'undefined') return null

    const content = (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 backdrop-blur-md"
                    onClick={onClose}
                >
                    <Box sx={{ position: 'absolute', top: 24, left: 24, zIndex: 10000 }}>
                        <Tooltip title="Back">
                            <IconButton onClick={onClose} sx={buttonStyle}>
                                <ArrowBackIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 24, right: 24, zIndex: 10000 }}>
                        <IconButton onClick={(e) => { e.stopPropagation(); resetZoom() }} sx={buttonStyle}>
                            <RestartAltIcon />
                        </IconButton>
                        <IconButton onClick={(e) => { e.stopPropagation(); setScale(s => Math.min(s + 0.5, 4)) }} sx={buttonStyle}>
                            <ZoomInIcon />
                        </IconButton>
                        <IconButton onClick={(e) => { e.stopPropagation(); setScale(s => Math.max(1, s - 0.5)); if (scale <= 1.5) setPosition({ x: 0, y: 0 }) }} sx={buttonStyle}>
                            <ZoomOutIcon />
                        </IconButton>
                        <IconButton onClick={onClose} sx={{ ...buttonStyle, bgcolor: 'rgba(220, 38, 38, 0.8)', '&:hover': { bgcolor: 'rgba(220, 38, 38, 1)' } }}>
                            <CloseIcon />
                        </IconButton>
                    </Stack>

                    <IconButton
                        onClick={(e) => { e.stopPropagation(); handleNavigate('prev') }}
                        sx={{ position: 'absolute', left: 24, zIndex: 10000, display: { xs: 'none', md: 'flex' }, ...buttonStyle }}
                    >
                        <ArrowBackIosNewIcon />
                    </IconButton>

                    <div
                        ref={containerRef}
                        className="w-full h-full flex items-center justify-center overflow-hidden cursor-move"
                        onWheel={handleWheel}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <motion.img
                            key={currentIndex}
                            src={images[currentIndex]}
                            alt="Lightbox"
                            draggable={false}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{
                                scale: scale,
                                x: position.x,
                                y: position.y,
                                opacity: 1,
                                transition: { duration: isDragging ? 0 : 0.2 }
                            }}
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', cursor: scale > 1 ? 'grab' : 'default' }}
                        />
                    </div>

                    <IconButton
                        onClick={(e) => { e.stopPropagation(); handleNavigate('next') }}
                        sx={{ position: 'absolute', right: 24, zIndex: 10000, display: { xs: 'none', md: 'flex' }, ...buttonStyle }}
                    >
                        <ArrowForwardIosIcon />
                    </IconButton>

                    <Box sx={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', color: 'white', bgcolor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', px: 3, py: 1, borderRadius: 8, fontSize: '0.9rem', fontWeight: 600, zIndex: 10000 }}>
                        {currentIndex + 1} / {images.length}
                    </Box>
                </motion.div>
            )}
        </AnimatePresence>
    )

    return createPortal(content, document.body)
}