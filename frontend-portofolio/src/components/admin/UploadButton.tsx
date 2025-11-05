import { useRef, useState, ChangeEvent } from 'react'
import { Button, Typography, Stack } from '@mui/material'
import { uploadFile } from '../../api/upload'
import { alert } from '../../utils/confirm'

interface UploadButtonProps {
    label?: string
    multiple?: boolean
    onUploaded: (url: string | string[]) => void
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
            if (multiple) {
                const urls = await Promise.all(files.map(uploadFile))
                onUploaded(urls)
            } else {
                const url = await uploadFile(files[0])
                onUploaded(url)
            }
        } catch (error) {
            console.error("Upload failed:", error)
            alert({ title: 'Upload Gagal', text: 'Terjadi kesalahan saat mengunggah file.', icon: 'error' })
        } finally {
            setBusy(false)
            if (e.target) e.target.value = ''
        }
    }

    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <input ref={inputRef} type="file" accept="image/*,application/pdf" hidden multiple={multiple} onChange={handleChange} />
            <Button variant="outlined" onClick={onPick} disabled={busy}>
                {busy ? 'Mengunggah…' : label}
            </Button>
            <Typography variant="caption" color="text.secondary">PNG/JPG/PDF</Typography>
        </Stack>
    )
}