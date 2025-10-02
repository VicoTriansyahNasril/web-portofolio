//src/components/admin/UploadButton.jsx
import { useRef, useState } from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import { api } from '../../api/client'

export default function UploadButton({ label = 'Unggah', multiple = false, onUploaded }) {
    const inputRef = useRef(null)
    const [busy, setBusy] = useState(false)

    const onPick = () => inputRef.current?.click()

    const handleChange = async (e) => {
        const files = Array.from(e.target.files || [])
        if (!files.length) return
        setBusy(true)
        try {
            const urls = []
            for (const f of files) {
                const fd = new FormData()
                fd.append('file', f)
                const { data } = await api.post('/api/admin/upload', fd, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                })
                urls.push(data?.url)
            }
            onUploaded?.(multiple ? urls : urls[0])
        } finally {
            setBusy(false)
            e.target.value = ''
        }
    }

    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <input ref={inputRef} type="file" accept="image/*" hidden multiple={multiple} onChange={handleChange} />
            <Button variant="outlined" onClick={onPick} disabled={busy}>
                {busy ? 'Mengunggah…' : label}
            </Button>
            <Typography variant="caption" color="text.secondary">PNG/JPG, maksimal beberapa MB</Typography>
        </Stack>
    )
}
