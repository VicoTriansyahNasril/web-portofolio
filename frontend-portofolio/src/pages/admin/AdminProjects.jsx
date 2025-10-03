/* eslint-disable no-unused-vars */
// src/pages/admin/AdminProjects.jsx
import { useEffect, useRef, useState } from 'react'
import { Box, Button, Chip, IconButton, Paper, Stack, Typography, Divider, CircularProgress } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import { deleteProject, getProjectsAdmin, createProject, updateProject, reorderProjects } from '../../api/projects'
import ProjectForm from '../../components/admin/ProjectForm'
import ProjectPreview from '../../components/admin/ProjectPreview'
import { alert, confirm } from '../../utils/confirm'

export default function AdminProjects() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const [initial, setInitial] = useState({})
    const [previewOpen, setPreviewOpen] = useState(false)
    const [previewProject, setPreviewProject] = useState(null)
    const [dragIdx, setDragIdx] = useState(null)
    const [overIdx, setOverIdx] = useState(null)
    const dragIndexRef = useRef(null)

    const fetchProjects = async () => {
        const data = await getProjectsAdmin()
        const sorted = [...(data || [])].sort((a, b) => {
            const ao = a.sort_order ?? 1e9
            const bo = b.sort_order ?? 1e9
            return ao - bo || new Date(b.created_at) - new Date(a.created_at)
        })
        setItems(sorted)
        setLoading(false)
    }

    useEffect(() => {
        fetchProjects()
    }, [])

    const handleNew = () => { setInitial({}); setEditing(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }
    const handleEdit = (p) => {
        const safe = { ...p, gallery: Array.isArray(p.gallery) ? [...p.gallery] : [] }
        setInitial(safe); setEditing(true); window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDelete = async (id, title) => {
        const res = await confirm({ title: `Hapus "${title}"?`, text: 'Aksi ini tidak bisa dibatalkan.' })
        if (res.isConfirmed) {
            try {
                await deleteProject(id)
                setItems((prev) => prev.filter((x) => x.id !== id))
                alert({ title: 'Sukses', text: 'Proyek berhasil dihapus.' })
            } catch (_err) {
                alert({ title: 'Error', text: 'Gagal menghapus proyek.', icon: 'error' })
            }
        }
    }

    const onSubmit = async (payload) => {
        try {
            if (initial?.id) {
                await updateProject(initial.id, payload)
            } else {
                await createProject(payload)
            }
            setEditing(false); setInitial({})
            alert({ title: 'Sukses', text: 'Proyek berhasil disimpan.' })
            fetchProjects()
        } catch (_err) {
            alert({ title: 'Error', text: 'Gagal menyimpan proyek.', icon: 'error' })
        }
    }

    const onRowDragStart = (e, idx) => {
        dragIndexRef.current = idx; setDragIdx(idx)
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/html', null)
    }
    const onRowDragOver = (e, idx) => { e.preventDefault(); setOverIdx(idx) }
    const onRowDrop = async (e, idx) => {
        e.preventDefault()
        const from = dragIndexRef.current; const to = idx
        setOverIdx(null); setDragIdx(null); dragIndexRef.current = null
        if (from === null || to === null || from === to) return

        const originalOrder = [...items]
        const next = [...items]
        const [moved] = next.splice(from, 1)
        next.splice(to, 0, moved)
        setItems(next)

        try {
            await reorderProjects(next.map((p, i) => ({ id: p.id, sort_order: i })))
        } catch {
            alert({ title: 'Error', text: 'Gagal menyimpan urutan baru.', icon: 'error' })
            setItems(originalOrder)
        }
    }
    const onRowDragEnd = () => { setOverIdx(null); setDragIdx(null); dragIndexRef.current = null }

    if (loading) return <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 400 }}><CircularProgress /></Box>

    return (
        <Box sx={{ maxWidth: 980, mx: 'auto' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h5" fontWeight={800}>Kelola Projects</Typography>
                {!editing && <Button startIcon={<AddIcon />} variant="contained" onClick={handleNew}>Tambah Project</Button>}
            </Stack>

            {editing && (
                <ProjectForm
                    initial={initial}
                    onSubmit={onSubmit}
                    onCancel={() => { setEditing(false); setInitial({}) }}
                />
            )}
            {!editing && items.length > 0 && <Divider sx={{ my: 2 }} />}

            {!editing && (
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
                                <IconButton onClick={() => { setPreviewProject(p); setPreviewOpen(true) }}><VisibilityIcon /></IconButton>
                                <IconButton onClick={() => handleEdit(p)}><EditIcon /></IconButton>
                                <IconButton color="error" onClick={() => handleDelete(p.id, p.title)}><DeleteIcon /></IconButton>
                            </Stack>
                        </Paper>
                    ))}
                </Stack>
            )}

            <ProjectPreview open={previewOpen} onClose={() => setPreviewOpen(false)} project={previewProject || {}} />
        </Box>
    )
}