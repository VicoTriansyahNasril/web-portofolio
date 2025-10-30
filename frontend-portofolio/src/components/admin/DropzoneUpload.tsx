import { useCallback } from 'react'
import { useDropzone, FileRejection, DropzoneOptions } from 'react-dropzone'

interface DropzoneUploadProps {
    onDrop: (acceptedFiles: File[]) => void
    accept?: DropzoneOptions['accept']
    maxSize?: number
    multiple?: boolean
    disabled?: boolean
}

export default function DropzoneUpload({
    onDrop,
    accept = { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'] },
    maxSize = 5242880,
    multiple = false,
    disabled = false,
}: DropzoneUploadProps) {
    const handleDrop = useCallback(
        (acceptedFiles: File[], fileRejections: FileRejection[]) => {
            if (fileRejections.length > 0) {
                const errors = fileRejections.map((file) =>
                    file.errors.map((e) => e.message).join(', ')
                )
                alert(`Upload failed: ${errors.join('; ')}`)
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
        <div
            {...getRootProps()}
            className={`
                border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                ${isDragActive && !isDragReject ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : ''}
                ${isDragReject ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}
                ${!isDragActive && !isDragReject ? 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500' : ''}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
        >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-3">
                <svg
                    className={`w-12 h-12 ${isDragActive ? 'text-primary-500' : 'text-gray-400'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                </svg>
                {isDragActive ? (
                    <p className="text-primary-600 dark:text-primary-400 font-medium">
                        Drop the files here...
                    </p>
                ) : (
                    <div>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">
                            Drag & drop {multiple ? 'files' : 'a file'} here, or click to select
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Max size: {(maxSize / 1024 / 1024).toFixed(1)}MB
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}