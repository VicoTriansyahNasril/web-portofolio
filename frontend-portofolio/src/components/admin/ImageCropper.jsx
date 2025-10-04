// src/components/admin/ImageCropper.jsx
import { useEffect, useRef, useState, useCallback } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Slider, Stack, ToggleButtonGroup, ToggleButton, Box
} from '@mui/material';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const PRESETS = [
    { key: 'free', label: 'BEBAS', value: 0 },
    { key: '16:9', label: '16:9 (LAPTOP)', value: 16 / 9 },
    { key: '4:3', label: '4:3', value: 4 / 3 },
    { key: '1:1', label: '1:1', value: 1 },
    { key: '9:16', label: '9:16 (STORY)', value: 9 / 16 },
];

function toCanvasBlob(canvas, type = 'image/jpeg', quality = 0.92) {
    return new Promise((resolve) => canvas.toBlob((b) => resolve(b), type, quality));
}

export default function ImageCropper({ open, src, onClose, onCropped, initialAspect }) {
    const imgRef = useRef(null);
    const [zoom, setZoom] = useState(1);
    const [aspect, setAspect] = useState(initialAspect === undefined ? 0 : initialAspect);
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState();

    useEffect(() => {
        if (open) {
            setAspect(initialAspect === undefined ? 0 : initialAspect);
            setZoom(1);
            setCrop(undefined);
            setCompletedCrop(undefined);
        }
    }, [open, initialAspect]);

    const onImageLoad = useCallback((e) => {
        const img = e.currentTarget;
        const { width, height } = img;
        const initialWidth = 90;
        let newCrop;

        if (aspect) {
            newCrop = makeAspectCrop({ unit: '%', width: initialWidth }, aspect, width, height);
        } else {
            const newHeight = (initialWidth / 100) * (height / width) * 100;
            newCrop = { unit: '%', width: initialWidth, height: newHeight };
        }
        setCrop(centerCrop(newCrop, width, height));
    }, [aspect]);

    useEffect(() => {
        if (!imgRef.current) return;
        onImageLoad({ currentTarget: imgRef.current });
    }, [aspect, onImageLoad]);

    const handleSave = async () => {
        const image = imgRef.current;
        const cropData = completedCrop;

        if (!image || !cropData || !cropData.width || !cropData.height) {
            console.error("Invalid crop selection.");
            return;
        }

        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        canvas.width = Math.floor(cropData.width * scaleX);
        canvas.height = Math.floor(cropData.height * scaleY);

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(
            image,
            Math.floor(cropData.x * scaleX),
            Math.floor(cropData.y * scaleY),
            Math.floor(cropData.width * scaleX),
            Math.floor(cropData.height * scaleY),
            0,
            0,
            canvas.width,
            canvas.height
        );

        const blob = await toCanvasBlob(canvas);
        onCropped?.(blob);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" PaperProps={{ sx: { width: '90vw', maxWidth: '1200px' } }}>
            <DialogTitle>Crop Gambar</DialogTitle>
            <DialogContent>
                <Box sx={{
                    width: '100%',
                    height: '65vh',
                    position: 'relative',
                    bgcolor: 'action.hover',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {src && (
                        <ReactCrop
                            crop={crop}
                            onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
                            onComplete={(pixelCrop) => setCompletedCrop(pixelCrop)}
                            aspect={aspect || undefined}
                            keepSelection
                        >
                            <img
                                ref={imgRef}
                                src={src}
                                alt="to-crop"
                                onLoad={onImageLoad}
                                style={{
                                    transform: `scale(${zoom})`,
                                    maxHeight: '65vh',
                                    maxWidth: '100%',
                                    objectFit: 'contain',
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
    );
}