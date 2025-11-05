import { useState, useRef, DragEvent } from 'react'
import { Box, Button, Chip, IconButton, Paper, Stack, Typography, Divider, CircularProgress, Alert } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import useSWR from 'swr'
import { deleteAdminProject, createAdminProject, updateAdminProject, reorderAdminProjects } from '../../api/projects'
import ProjectForm from '../../components/admin/ProjectForm'
import ProjectPreview from '../../components/admin/ProjectPreview'
import { alert, confirm } from '../../utils/confirm'
import { Project } from '../../types'

const PROJECTS_API_KEY = '/api/admin/projects'

export default function AdminProjects() {
    const { data: items, error, isLoading, mutate } = useSWR<Project[]>(PROJECTS_API_KEY)
    const [editing, setEditing] = useState(false)
    const [initialData, setInitialData] = useState<Partial<Project>>({})
    const [previewProject, setPreviewProject] = useState<Project | null>(null)
    const [dragIdx, setDragIdx] = useState<number | null>(null)
    const [overIdx, setOverIdx] = useState<number | null>(null)
    const dragIndexRef = useRef<number | null>(null)

    const handleNew = () => { setInitialData({}); setEditing(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }
    const handleEdit = (p: Project) => { setInitialData(p); setEditing(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }

    const handleDelete = async (id: number, title: string) => {
        const res = await confirm({ title: `Hapus "${title}"?`, text: 'Aksi ini tidak bisa dibatalkan.' })
        if (res.isConfirmed) {
            const optimisticData = items?.filter((p) => p.id !== id)
            await mutate(optimisticData, false)
            try {
                await deleteAdminProject(id)
                alert({ title: 'Sukses', text: 'Proyek berhasil dihapus.' })
            } catch (_err) {
                await mutate(items, false)
                alert({ title: 'Error', text: 'Gagal menghapus proyek.', icon: 'error' })
            }
        }
    }

    const onSubmit = async (payload: Partial<Project>) => {
        try {
            if (initialData?.id) {
                await updateAdminProject(initialData.id, payload)
            } else {
                await createAdminProject(payload)
            }
            setEditing(false); setInitialData({})
            mutate()
            alert({ title: 'Sukses', text: 'Proyek berhasil disimpan.' })
        } catch (_err) {
            alert({ title: 'Error', text: 'Gagal menyimpan proyek.', icon: 'error' })
        }
    }

    const onRowDragStart = (e: DragEvent, idx: number) => { dragIndexRef.current = idx; setDragIdx(idx); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/html', '') }
    const onRowDragOver = (e: DragEvent, idx: number) => { e.preventDefault(); setOverIdx(idx) }
    const onRowDrop = async (e: DragEvent, idx: number) => {
        e.preventDefault()
        const from = dragIndexRef.current; const to = idx
        setOverIdx(null); setDragIdx(null); dragIndexRef.current = null
        if (from === null || to === null || from === to || !items) return

        const originalOrder = [...items]
        const next = [...originalOrder]
        const [moved] = next.splice(from, 1)
        next.splice(to, 0, moved)

        await mutate(next, false)
        try {
            const reorderPayload = next.map((p, i) => ({ id: p.id, sort_order: i }))
            await reorderAdminProjects(reorderPayload)
        } catch {
            alert({ title: 'Error', text: 'Gagal menyimpan urutan baru.', icon: 'error' })
            await mutate(originalOrder, false)
        }
    }
    const onRowDragEnd = () => { setOverIdx(null); setDragIdx(null); dragIndexRef.current = null }

    if (isLoading) return <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 400 }}><CircularProgress /></Box>
    if (error) return <Alert severity="error">Gagal memuat data proyek.</Alert>

    return (
        <Box sx={{ maxWidth: 980, mx: 'auto' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h5" fontWeight={800}>Kelola Projects</Typography>
                {!editing && <Button startIcon={<AddIcon />} variant="contained" onClick={handleNew}>Tambah Project</Button>}
            </Stack>

            {editing && (
                <ProjectForm
                    initialData={initialData}
                    onSubmit={onSubmit}
                    onCancel={() => { setEditing(false); setInitialData({}) }}
                />
            )}
            {!editing && items && items.length > 0 && <Divider sx={{ my: 2 }} />}

            {!editing && items && (
                <Stack spacing={2} sx={{
                    '& .row': { transition: 'transform .18s ease, box-shadow .18s ease' },
                    '& .row.dragging': { transform: 'scale(1.01)', boxShadow: 6, opacity: 0.9, cursor: 'grabbing' },
                    '& .row.over': { boxShadow: 4 },
                }}>
                    {items.map((p, idx) => (
                        <Paper
                            key={p.id}
                            className={`row${dragIdx === idx ? ' dragging' : ''}${overIdx === idx ? ' over' : ''}`}
                            draggable
                            onDragStart={(e) => onRowDragStart(e, idx)}
                            onDragOver={(e) => onRowDragOver(e, idx)}
                            onDrop={(e) => onRowDrop(e, idx)}
                            onDragEnd={onRowDragEnd}
                            sx={{ p: 2, display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 2 }}
                        >
                            <Box sx={{ color: 'text.secondary', cursor: 'grab', '&:active': { cursor: 'grabbing' } }}>
                                <DragIndicatorIcon />
                            </Box>
                            <Box>
                                <Typography fontWeight={700}>{p.title}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}>{p.summary}</Typography>
                                <Stack direction="row" spacing={1}>
                                    <Chip size="small" label={p.status} color={p.status === 'published' ? 'success' : 'default'} />
                                    {p.role && <Chip size="small" label={p.role} />}
                                </Stack>
                            </Box>
                            <Stack direction="row" spacing={0.5}>
                                <IconButton onClick={() => setPreviewProject(p)}><VisibilityIcon /></IconButton>
                                <IconButton onClick={() => handleEdit(p)}><EditIcon /></IconButton>
                                <IconButton color="error" onClick={() => handleDelete(p.id, p.title)}><DeleteIcon /></IconButton>
                            </Stack>
                        </Paper>
                    ))}
                </Stack>
            )}

            {previewProject && (
                <ProjectPreview project={previewProject} />
            )}
        </Box>
    )
}