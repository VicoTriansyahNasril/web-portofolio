import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { Project } from '../../types'
import { slugify, isValidSlug } from '../../utils/slugify'
import { uploadFile } from '../../api/upload'

interface UseProjectFormProps {
    initialData?: Partial<Project> | null
    onSubmit: (data: Partial<Project>) => Promise<void>
}

const formatDate = (iso?: string | null) => iso ? new Date(iso).toISOString().split('T')[0] : ''

export function useProjectForm({ initialData, onSubmit }: UseProjectFormProps) {
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        role: '',
        summary: '',
        body: '',
        techStack: '',
        demoUrl: '',
        repoUrl: '',
        coverUrl: '',
        startDate: '',
        endDate: '',
        isFeatured: false,
        status: 'draft' as 'draft' | 'published'
    })

    const [gallery, setGallery] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [slugError, setSlugError] = useState('')

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                slug: initialData.slug || '',
                role: initialData.role || '',
                summary: initialData.summary || '',
                body: initialData.body || '',
                techStack: initialData.tech_stack || '',
                demoUrl: initialData.demo_url || '',
                repoUrl: initialData.repo_url || '',
                coverUrl: initialData.cover_url || '',
                startDate: formatDate(initialData.start_date),
                endDate: formatDate(initialData.end_date),
                isFeatured: initialData.is_featured || false,
                status: initialData.status || 'draft'
            })
            setGallery(initialData.gallery || [])
        }
    }, [initialData])

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        if (name === 'title' && !initialData?.id) {
            const genSlug = slugify(value)
            setFormData(prev => ({ ...prev, slug: genSlug }))
            validateSlug(genSlug)
        }
        if (name === 'slug') validateSlug(value)
    }

    const handleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.checked }))
    }

    const validateSlug = (val: string) => {
        if (!val) setSlugError('Slug required')
        else if (!isValidSlug(val)) setSlugError('Invalid format')
        else setSlugError('')
    }

    const handleUploadGallery = async (files: FileList | null) => {
        if (!files?.length) return
        setLoading(true)
        try {
            const urls = await Promise.all(Array.from(files).map(uploadFile))
            setGallery(prev => [...prev, ...urls])
        } finally {
            setLoading(false)
        }
    }

    const submit = async (e: FormEvent) => {
        e.preventDefault()
        if (slugError) return
        setLoading(true)
        try {
            await onSubmit({
                title: formData.title,
                slug: formData.slug,
                role: formData.role,
                summary: formData.summary,
                body: formData.body,
                tech_stack: formData.techStack,
                demo_url: formData.demoUrl,
                repo_url: formData.repoUrl,
                cover_url: formData.coverUrl,
                start_date: formData.startDate ? new Date(formData.startDate).toISOString() : null,
                end_date: formData.endDate ? new Date(formData.endDate).toISOString() : null,
                gallery,
                is_featured: formData.isFeatured,
                status: formData.status,
            })
        } finally {
            setLoading(false)
        }
    }

    return {
        formData, setFormData,
        gallery, setGallery,
        loading, setLoading,
        slugError,
        handleChange,
        handleCheckbox,
        handleUploadGallery,
        submit
    }
}