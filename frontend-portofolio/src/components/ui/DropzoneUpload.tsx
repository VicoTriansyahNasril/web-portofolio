import { useCallback } from 'react'
import { useDropzone, FileRejection, DropzoneOptions } from 'react-dropzone'
import { Box, Typography, alpha, useTheme, Stack } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { alert } from '@/utils/confirm'

interface DropzoneUploadProps {
    onDrop: (acceptedFiles: File[]) => void
    accept?: DropzoneOptions['accept']
    maxSize?: number
    multiple?: boolean
    disabled?: boolean
    label?: string
}

export default function DropzoneUpload({
    onDrop,
    accept = { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'] },
    maxSize = 5242880,
    multiple = false,
    disabled = false,
    label
}: DropzoneUploadProps) {
    const theme = useTheme()

    const handleDrop = useCallback(
        (acceptedFiles: File[], fileRejections: FileRejection[]) => {
            if (fileRejections.length > 0) {
                const errors = fileRejections.map((file) =>
                    file.errors.map((e) => e.message).join(', ')
                )
                alert({ title: 'Upload Failed', text: errors.join('; '), icon: 'error' })
                return
            }
            onDrop(acceptedFiles)
        },
        [onDrop]
    )

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop: handleDrop,
        accept,
        maxSize,
        multiple,
        disabled,
    })

    return (
        <Box
            {...getRootProps()}
            sx={{
                border: '2px dashed',
                borderColor: isDragReject
                    ? 'error.main'
                    : isDragActive
                        ? 'primary.main'
                        : 'divider',
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                cursor: disabled ? 'not-allowed' : 'pointer',
                bgcolor: isDragActive
                    ? alpha(theme.palette.primary.main, 0.08)
                    : 'background.paper',
                transition: 'all 0.2s ease-in-out',
                opacity: disabled ? 0.5 : 1,
                '&:hover': {
                    borderColor: !disabled && !isDragReject ? 'primary.main' : undefined,
                    bgcolor: !disabled && !isDragActive ? alpha(theme.palette.primary.main, 0.04) : undefined
                }
            }}
        >
            <input {...getInputProps()} />
            <Stack spacing={2} alignItems="center">
                <CloudUploadIcon
                    sx={{
                        fontSize: 48,
                        color: isDragActive ? 'primary.main' : 'text.disabled'
                    }}
                />
                <Box>
                    <Typography variant="subtitle1" fontWeight={600} color={isDragActive ? 'primary.main' : 'text.primary'}>
                        {isDragActive ? 'Drop files here' : (label || 'Drag & drop files here')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        or click to select files
                    </Typography>
                </Box>
                <Typography variant="caption" color="text.disabled">
                    Max size: {(maxSize / 1024 / 1024).toFixed(1)}MB
                </Typography>
            </Stack>
        </Box>
    )
}