//src/components/admin/DropzoneUpload.jsx
import { useCallback, useState, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { Box, Button, Stack, Typography } from '@mui/material'
import { api } from '../../api/client'

export default function DropzoneUpload({ label = 'Tambah Gambar', multiple = true, onUploaded, height = 140 }) {
    const [busy, setBusy] = useState(false)
    const fileRef = useRef(null)

    const uploadFiles = async (files) => {
        const urls = []
        for (const f of files) {
            const fd = new FormData()
            fd.append('file', f)
            const { data } = await api.post('/api/admin/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
            urls.push(data?.url)
        }
        return urls
    }

    const onDrop = useCallback(async (accepted) => {
        if (!accepted?.length) return
        setBusy(true)
        try {
            const urls = await uploadFiles(accepted)
            onUploaded?.(multiple ? urls : urls[0])
        } finally {
            setBusy(false)
        }
    }, [multiple, onUploaded])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple,
        accept: { 'image/*': [] },
        noClick: true,
    })

    const onPick = () => fileRef.current?.click()
    const onManualPick = async (e) => {
        const files = Array.from(e.target.files || [])
        if (!files.length) return
        setBusy(true)
        try {
            const urls = await uploadFiles(files)
            onUploaded?.(multiple ? urls : urls[0])
        } finally {
            setBusy(false)
            e.target.value = ''
        }
    }

    return (
        <Stack spacing={1}>
            <Box
                {...getRootProps()}
                sx={{
                    border: '1px dashed',
                    borderColor: 'divider',
                    borderRadius: 2,
                    height,
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: t => isDragActive ? `${t.palette.primary.main}11` : 'transparent',
                    transition: 'background .2s',
                    px: 2,
                    textAlign: 'center',
                }}
            >
                <input {...getInputProps()} />
                <Typography variant="body2" color="text.secondary">
                    {busy ? 'Mengunggah…' : (isDragActive ? 'Lepaskan file di sini' : 'Tarik & letakkan gambar di sini')}
                </Typography>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
                <input ref={fileRef} type="file" accept="image/*" hidden multiple={multiple} onChange={onManualPick} />
                <Button variant="outlined" onClick={onPick} disabled={busy}>{label}</Button>
                <Typography variant="caption" color="text.secondary">PNG/JPG</Typography>
            </Stack>
        </Stack>
    )
}
