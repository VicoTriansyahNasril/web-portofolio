// src/components/admin/ProjectForm.jsx
import {
    Paper, Stack, TextField, MenuItem, Typography, Button, Divider,
    Box, Card, CardMedia, IconButton, Tooltip, FormControlLabel, Switch
} from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMemo, useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import DropzoneUpload from './DropzoneUpload'
import ProjectPreview from './ProjectPreview'
import GalleryManager from './GalleryManager'
import ImageCropper from './ImageCropper'
import { api } from '../../api/client'
import CropIcon from '@mui/icons-material/Crop'
import ClearIcon from '@mui/icons-material/Clear'
import { fileUrl } from '../../utils/url'

const MySwal = withReactContent(Swal)

const slugify = (s = '') =>
    s
        .toString()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 160)

const schema = Yup.object({
    slug: Yup.string().required('Slug wajib diisi').matches(/^[a-z0-9-]+$/, 'Gunakan huruf kecil, angka, dan strip (-)'),
    title: Yup.string().required('Judul wajib diisi').max(220),
    summary: Yup.string().required('Ringkasan wajib diisi').max(1000, 'Maksimal 1000 karakter'),
    body: Yup.string(),
    cover_url: Yup.string().nullable().max(500),
    repo_url: Yup.string().nullable().max(500),
    demo_url: Yup.string().nullable().max(500),
    role: Yup.string().nullable(),
    status: Yup.string().required(),
    tech_stack: Yup.string().nullable(),
})

export default function ProjectForm({ initial = {}, onSubmit, onCancel }) {
    const init = useMemo(() => ({
        slug: initial.slug || '',
        title: initial.title || '',
        summary: initial.summary || '',
        body: initial.body || '',
        cover_url: initial.cover_url || '',
        repo_url: initial.repo_url || '',
        demo_url: initial.demo_url || '',
        role: initial.role || '',
        status: initial.status || 'published',
        is_featured: initial.is_featured || false,
        gallery: Array.isArray(initial.gallery) ? initial.gallery : [],
        tech_stack: initial.tech_stack || '',
    }), [initial])

    const [previewOpen, setPreviewOpen] = useState(false)
    const [gallery, setGallery] = useState(init.gallery)
    const [cropOpen, setCropOpen] = useState(false)
    const [coverSrc, setCoverSrc] = useState(init.cover_url || '')

    useEffect(() => {
        setGallery(Array.isArray(initial.gallery) ? initial.gallery : [])
        setCoverSrc(initial.cover_url || '')
    }, [initial])

    const formik = useFormik({
        initialValues: init,
        enableReinitialize: true,
        validationSchema: schema,
        onSubmit: async (values) => {
            const res = await MySwal.fire({
                title: initial.id ? 'Update project?' : 'Simpan project baru?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Ya',
                cancelButtonText: 'Batal',
            })
            if (res.isConfirmed) {
                await onSubmit({ ...values, gallery })
            }
        },
    })

    const { values, errors, touched, handleChange, handleSubmit, setFieldValue } = formik

    const uploadBlob = async (blob) => {
        const fd = new FormData()
        fd.append('file', blob, 'crop.jpg')
        const { data } = await api.post('/api/admin/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        return data?.url
    }

    const handleTitleChange = (e) => {
        const v = e.target.value
        handleChange(e)
        if (!initial.id) {
            const currentSlug = formik.values.slug || ''
            if (!currentSlug || currentSlug === slugify(currentSlug)) {
                setFieldValue('slug', slugify(v))
            }
        }
    }

    const handleSlugBlur = () => {
        if (values.slug) setFieldValue('slug', slugify(values.slug))
    }

    return (
        <Paper sx={{ p: 3, mt: 4 }}>
            <Typography variant="h6" gutterBottom>{initial.id ? 'Edit Project' : 'New Project'}</Typography>
            <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    <TextField name="slug" label="Slug (unik untuk URL)" value={values.slug} onChange={handleChange} onBlur={handleSlugBlur} error={touched.slug && Boolean(errors.slug)} helperText={touched.slug && errors.slug} />
                    <TextField name="title" label="Judul Project" value={values.title} onChange={handleTitleChange} error={touched.title && Boolean(errors.title)} helperText={touched.title && errors.title} />
                    <TextField name="summary" label="Ringkasan (untuk card)" value={values.summary} onChange={handleChange} error={touched.summary && Boolean(errors.summary)} helperText={touched.summary && errors.summary} multiline minRows={2} />

                    <TextField name="tech_stack" label="Tech Stack (pisahkan dengan koma)" value={values.tech_stack} onChange={handleChange} helperText="Contoh: React, Go, PostgreSQL, Docker" />

                    <TextField name="body" label="Deskripsi Lengkap (Markdown didukung)" value={values.body} onChange={handleChange} multiline rows={10} />

                    <DropzoneUpload key={`dz-cover-${initial.id || 'new'}`} label="Sampul (thumbnail)" multiple={false} onUploaded={(url) => { setFieldValue('cover_url', url); setCoverSrc(url) }} />
                    <TextField name="cover_url" label="Sampul (URL)" value={values.cover_url} onChange={(e) => { handleChange(e); setCoverSrc(e.target.value) }} />

                    {values.cover_url ? (
                        <Card sx={{ maxWidth: 360, position: 'relative', mt: 1 }}>
                            <CardMedia component="img" image={fileUrl(values.cover_url)} alt="Sampul" />
                            <Tooltip title="Crop Sampul"><IconButton size="small" sx={{ position: 'absolute', top: 8, right: 44, bgcolor: 'rgba(0,0,0,.5)', color: 'white' }} onClick={() => setCropOpen(true)}><CropIcon fontSize="small" /></IconButton></Tooltip>
                            <Tooltip title="Hapus Sampul"><IconButton size="small" sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,.5)', color: 'white' }} onClick={() => { setFieldValue('cover_url', ''); setCoverSrc('') }}><ClearIcon fontSize="small" /></IconButton></Tooltip>
                        </Card>
                    ) : null}

                    <TextField name="repo_url" label="Repo URL (opsional)" value={values.repo_url} onChange={handleChange} />
                    <TextField name="demo_url" label="Demo URL (opsional)" value={values.demo_url} onChange={handleChange} />

                    <TextField name="role" select label="Peran (opsional)" value={values.role} onChange={handleChange}>
                        <MenuItem value="">(Tidak di-set)</MenuItem>
                        <MenuItem value="Frontend">Frontend</MenuItem>
                        <MenuItem value="Backend">Backend</MenuItem>
                        <MenuItem value="Fullstack">Fullstack</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </TextField>

                    <TextField name="status" select label="Status Publikasi" value={values.status} onChange={handleChange}>
                        <MenuItem value="published">Published</MenuItem>
                        <MenuItem value="draft">Draft</MenuItem>
                    </TextField>

                    <FormControlLabel control={<Switch checked={values.is_featured} onChange={handleChange} name="is_featured" />} label="Tandai sebagai Proyek Unggulan" />

                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle1">Galeri (opsional)</Typography>
                    <DropzoneUpload key={`dz-gallery-${initial.id || 'new'}`} label="Tambah Gambar Galeri" multiple onUploaded={(urls) => { const arr = Array.isArray(urls) ? urls : [urls]; setGallery((prev) => [...prev, ...arr]) }} />
                    <Box sx={{ mt: 1 }}><GalleryManager key={`gm-${initial.id || 'new'}`} items={gallery} onChange={setGallery} /></Box>

                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button variant="text" onClick={() => setPreviewOpen(true)}>Preview</Button>
                        <Button variant="outlined" onClick={onCancel}>Batal</Button>
                        <Button variant="contained" type="submit">Simpan</Button>
                    </Stack>
                </Stack>
            </form>

            <ProjectPreview open={previewOpen} onClose={() => setPreviewOpen(false)} project={{ ...values, gallery }} />
            <ImageCropper open={cropOpen} src={coverSrc} aspect={16 / 9} onClose={() => setCropOpen(false)} onCropped={async (blob) => { const url = await uploadBlob(blob); setFieldValue('cover_url', url); setCoverSrc(url); setCropOpen(false) }} />
        </Paper>
    )
}