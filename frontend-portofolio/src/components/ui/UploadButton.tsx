import { useRef, useState, ChangeEvent } from 'react'
import { Button, Typography, Stack, CircularProgress } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { uploadFile } from '@/api/upload' // Asumsi api upload masih di shared
import { alert } from '@/utils/confirm'

interface UploadButtonProps {
    label?: string
    multiple?: boolean
    onUploaded: (url: string | string[]) => void
    variant?: 'contained' | 'outlined' | 'text'
    fullWidth?: boolean
}

export default function UploadButton({
    label = 'Upload',
    multiple = false,
    onUploaded,
    variant = 'outlined',
    fullWidth = false
}: UploadButtonProps) {
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
            alert({ title: 'Error', text: 'Failed to upload file.', icon: 'error' })
        } finally {
            setBusy(false)
            if (e.target) e.target.value = ''
        }
    }

    return (
        <Stack direction="row" spacing={2} alignItems="center" width={fullWidth ? '100%' : 'auto'}>
            <input ref={inputRef} type="file" accept="image/*,application/pdf" hidden multiple={multiple} onChange={handleChange} />
            <Button
                variant={variant}
                onClick={onPick}
                disabled={busy}
                startIcon={busy ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
                fullWidth={fullWidth}
            >
                {busy ? 'Uploading...' : label}
            </Button>
            {!fullWidth && <Typography variant="caption" color="text.secondary">Max 5MB</Typography>}
        </Stack>
    )
}