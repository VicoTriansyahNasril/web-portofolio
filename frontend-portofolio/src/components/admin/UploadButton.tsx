import { useRef, useState, ChangeEvent } from 'react'
import { Button, Typography, Stack } from '@mui/material'
import { api } from '../../api/client'

interface UploadButtonProps {
    label?: string;
    multiple?: boolean;
    onUploaded: (url: string | string[]) => void;
}

export default function UploadButton({ label = 'Unggah', multiple = false, onUploaded }: UploadButtonProps) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [busy, setBusy] = useState(false)

    const onPick = () => inputRef.current?.click()

    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (!files.length) return
        setBusy(true)
        try {
            const urls = []
            for (const f of files) {
                const fd = new FormData()
                fd.append('file', f)
                const { data } = await api.post('/api/admin/upload', fd);
                if (data?.url) {
                    urls.push(data.url);
                }
            }
            if (urls.length > 0) {
                onUploaded(multiple ? urls : urls[0]);
            }
        } catch (error) {
            console.error("Upload failed:", error);
        } finally {
            setBusy(false)
            if (e.target) e.target.value = ''
        }
    }

    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <input ref={inputRef} type="file" accept="image/*" hidden multiple={multiple} onChange={handleChange} />
            <Button variant="outlined" onClick={onPick} disabled={busy}>
                {busy ? 'Mengunggah…' : label}
            </Button>
            <Typography variant="caption" color="text.secondary">PNG/JPG</Typography>
        </Stack>
    )
}