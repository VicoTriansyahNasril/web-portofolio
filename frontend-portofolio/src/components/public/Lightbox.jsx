//src/components/public/Lightbox.jsx
import { useEffect, useMemo, useState } from 'react'
import { Box, Dialog, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

export default function Lightbox({ open, images = [], index = 0, onClose }) {
    const [i, setI] = useState(index)
    useEffect(() => { if (open) setI(index) }, [open, index])

    const has = useMemo(() => ({
        prev: i > 0,
        next: i < images.length - 1,
    }), [i, images.length])

    useEffect(() => {
        if (!open) return
        const onKey = (e) => {
            if (e.key === 'Escape') onClose?.()
            if (e.key === 'ArrowLeft' && has.prev) setI((v) => v - 1)
            if (e.key === 'ArrowRight' && has.next) setI((v) => v + 1)
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [open, has, onClose])

    return (
        <Dialog open={open} onClose={onClose} fullScreen PaperProps={{ sx: { bgcolor: 'rgba(0, 0, 0, 0.85)' } }}>
            <Box sx={{ position: 'fixed', top: 8, right: 8, zIndex: 2 }}>
                <IconButton onClick={onClose} sx={{ color: 'white' }}><CloseIcon /></IconButton>
            </Box>

            {has.prev && (
                <IconButton
                    onClick={() => setI(i - 1)}
                    sx={{ position: 'fixed', top: '50%', left: 8, transform: 'translateY(-50%)', color: 'white', zIndex: 2 }}
                >
                    <ArrowBackIosNewIcon />
                </IconButton>
            )}
            {has.next && (
                <IconButton
                    onClick={() => setI(i + 1)}
                    sx={{ position: 'fixed', top: '50%', right: 8, transform: 'translateY(-50%)', color: 'white', zIndex: 2 }}
                >
                    <ArrowForwardIosIcon />
                </IconButton>
            )}

            <Box sx={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', p: 4 }}>
                <img
                    src={images[i]}
                    alt={`img-${i}`}
                    style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'contain',
                        display: 'block'
                    }}
                />
            </Box>
        </Dialog>
    )
}