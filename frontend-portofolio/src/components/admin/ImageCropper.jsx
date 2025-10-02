// src/components/admin/ImageCropper.jsx
import { useEffect, useRef, useState, useCallback } from 'react'
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Slider, Stack, ToggleButtonGroup, ToggleButton, Box
} from '@mui/material'
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

const PRESETS = [
    { key: 'free', label: 'BEBAS', value: 0 },
    { key: '16:9', label: '16:9 (LAPTOP)', value: 16 / 9 },
    { key: '4:3', label: '4:3', value: 4 / 3 },
    { key: '1:1', label: '1:1', value: 1 },
    { key: '9:16', label: '9:16 (STORY)', value: 9 / 16 },
]

function toCanvasBlob(canvas, type = 'image/jpeg', quality = 0.92) {
    return new Promise((resolve) => canvas.toBlob((b) => resolve(b), type, quality))
}

export default function ImageCropper({ open, src, onClose, onCropped, initialAspect }) {
    const imgRef = useRef(null)
    const [zoom, setZoom] = useState(1)
    const [aspect, setAspect] = useState(initialAspect || 0) // 0 = free
    const [crop, setCrop] = useState()
    const [completedCrop, setCompletedCrop] = useState()

    // Hitung crop center saat gambar load / saat preset aspect berubah
    const onImageLoad = useCallback((e) => {
        const img = e.currentTarget
        const { width, height } = img
        if (aspect) {
            const mc = makeAspectCrop(
                { unit: '%', width: 90 }, // kasih lebar awal 90%
                aspect,
                width,
                height
            )
            setCrop(centerCrop(mc, width, height))
        } else {
            setCrop({ unit: '%', x: 5, y: 5, width: 90, height: 90 })
        }
    }, [aspect])

    useEffect(() => {
        // ketika user klik preset lain -> re-center crop instan
        if (!imgRef.current) return
        const img = imgRef.current
        const { width, height } = img
        if (aspect) {
            const mc = makeAspectCrop({ unit: '%', width: 90 }, aspect, width, height)
            setCrop(centerCrop(mc, width, height))
        } else {
            setCrop({ unit: '%', x: 5, y: 5, width: 90, height: 90 })
        }
    }, [aspect])

    const handleSave = async () => {
        if (!imgRef.current || !completedCrop) return
        const img = imgRef.current

        // Hitung ukuran crop dalam pixel
        const scaleX = img.naturalWidth / img.width
        const scaleY = img.naturalHeight / img.height

        const pixelRatio = window.devicePixelRatio || 1
        const canvas = document.createElement('canvas')
        canvas.width = Math.floor(completedCrop.width * scaleX * pixelRatio)
        canvas.height = Math.floor(completedCrop.height * scaleY * pixelRatio)
        const ctx = canvas.getContext('2d')

        ctx.imageSmoothingQuality = 'high'
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

        ctx.drawImage(
            img,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0, 0,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY
        )

        const blob = await toCanvasBlob(canvas, 'image/jpeg', 0.92)
        onCropped && onCropped(blob)
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Crop Gambar</DialogTitle>
            <DialogContent>
                <Box sx={{ position: 'relative', width: '100%', height: 460 }}>
                    {src && (
                        <ReactCrop
                            crop={crop}
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                            onComplete={(_, pc) => setCompletedCrop(pc)}
                            aspect={aspect || undefined}
                            keepSelection
                            ruleOfThirds
                        >
                            {/* zoom sederhana: pakai CSS scale pada img */}
                            <img
                                ref={imgRef}
                                src={src}
                                alt="to-crop"
                                onLoad={onImageLoad}
                                style={{
                                    transform: `scale(${zoom})`,
                                    transformOrigin: 'center center',
                                    maxHeight: '100%',
                                }}
                                crossOrigin="anonymous"
                            />
                        </ReactCrop>
                    )}
                </Box>

                <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 2 }}>
                    <span>Zoom</span>
                    <Slider min={1} max={3} step={0.01} value={zoom} onChange={(_, v) => setZoom(v)} />
                </Stack>

                <ToggleButtonGroup
                    exclusive
                    size="small"
                    value={aspect}
                    onChange={(_, v) => v !== null && setAspect(v)}
                    sx={{ mt: 1, flexWrap: 'wrap' }}
                >
                    {PRESETS.map(p => (
                        <ToggleButton key={p.key} value={p.value}>{p.label}</ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Batal</Button>
                <Button variant="contained" onClick={handleSave}>Simpan</Button>
            </DialogActions>
        </Dialog>
    )
}
