//src/components/public/Gallery.jsx
import { useState } from 'react'
import { Dialog, IconButton, ImageList, ImageListItem } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { fileUrl } from '../../utils/url'

export default function Gallery({ images = [] }) {
    const [open, setOpen] = useState(false)
    const [active, setActive] = useState(null)

    return (
        <>
            <ImageList cols={3} gap={8} sx={{ m: 0 }}>
                {images.map((u) => (
                    <ImageListItem key={u} sx={{ borderRadius: 2, overflow: 'hidden', cursor: 'zoom-in' }}>
                        <img src={fileUrl(u)} alt="" loading="lazy" onClick={() => { setActive(u); setOpen(true) }} />
                    </ImageListItem>
                ))}
            </ImageList>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <IconButton onClick={() => setOpen(false)} sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}>
                    <CloseIcon />
                </IconButton>
                {active ? <img src={fileUrl(active)} alt="" style={{ width: '100%', display: 'block' }} /> : null}
            </Dialog>
        </>
    )
}
