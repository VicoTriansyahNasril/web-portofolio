import { useState, useRef, DragEvent } from 'react'
import { Box, Button, Chip, IconButton, Paper, Stack, Typography, CircularProgress, Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import useSWR from 'swr'
import { projectAPI } from '@/features/projects/api/projectAPI'
import { Project } from '@/features/projects/types'
import { alert, confirm } from '@/utils/confirm'

export default function AdminProjects() {
    const navigate = useNavigate()
    const { data: items, error, isLoading, mutate } = useSWR<Project[]>('/api/admin/projects', projectAPI.getAllAdmin)

    const [dragIdx, setDragIdx] = useState<number | null>(null)
    const [overIdx, setOverIdx] = useState<number | null>(null)
    const dragIndexRef = useRef<number | null>(null)

    const handleNew = () => navigate('/admin/projects/new')
    const handleEdit = (id: number) => navigate(`/admin/projects/${id}`)

    const handleDelete = async (id: number, title: string) => {
        const res = await confirm({ title: `Delete "${title}"?`, text: 'This action cannot be undone.' })
        if (res.isConfirmed) {
            const optimisticData = items?.filter((p) => p.id !== id)
            await mutate(optimisticData, false)
            try {
                await projectAPI.delete(id)
                alert({ title: 'Deleted', text: 'Project deleted successfully.' })
                mutate()
            } catch (err) {
                console.error(err)
                await mutate(items, false)
                alert({ title: 'Error', text: 'Failed to delete project.', icon: 'error' })
            }
        }
    }

    const onRowDragStart = (e: DragEvent, idx: number) => {
        dragIndexRef.current = idx
        setDragIdx(idx)
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/html', '')
    }

    const onRowDragOver = (e: DragEvent, idx: number) => {
        e.preventDefault()
        setOverIdx(idx)
    }

    const onRowDrop = async (e: DragEvent, idx: number) => {
        e.preventDefault()
        const from = dragIndexRef.current
        const to = idx
        setOverIdx(null)
        setDragIdx(null)
        dragIndexRef.current = null

        if (from === null || to === null || from === to || !items) return

        const originalOrder = [...items]
        const next = [...originalOrder]
        const [moved] = next.splice(from, 1)
        next.splice(to, 0, moved)

        await mutate(next, false)
        try {
            const reorderPayload = next.map((p, i) => ({ id: p.id, sort_order: i }))
            await projectAPI.reorder(reorderPayload)
        } catch {
            alert({ title: 'Error', text: 'Failed to save order.', icon: 'error' })
            await mutate(originalOrder, false)
        }
    }

    const onRowDragEnd = () => {
        setOverIdx(null)
        setDragIdx(null)
        dragIndexRef.current = null
    }

    if (isLoading) return <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 400 }}><CircularProgress /></Box>
    if (error) return <Alert severity="error">Failed to load projects.</Alert>

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight={800}>Manage Projects</Typography>
                <Button startIcon={<AddIcon />} variant="contained" onClick={handleNew}>
                    New Project
                </Button>
            </Stack>

            <Stack spacing={2} sx={{
                '& .row': { transition: 'transform .2s ease, box-shadow .2s ease' },
                '& .row.dragging': { transform: 'scale(1.01)', boxShadow: 6, opacity: 0.9, cursor: 'grabbing', zIndex: 10 },
                '& .row.over': { boxShadow: 4, borderColor: 'primary.main' },
            }}>
                {items?.map((p, idx) => (
                    <Paper
                        key={p.id}
                        className={`row${dragIdx === idx ? ' dragging' : ''}${overIdx === idx ? ' over' : ''}`}
                        draggable
                        onDragStart={(e) => onRowDragStart(e, idx)}
                        onDragOver={(e) => onRowDragOver(e, idx)}
                        onDrop={(e) => onRowDrop(e, idx)}
                        onDragEnd={onRowDragEnd}
                        sx={{
                            p: 2,
                            display: 'grid',
                            gridTemplateColumns: 'auto 1fr auto',
                            alignItems: 'center',
                            gap: 3,
                            borderLeft: `4px solid ${p.status === 'published' ? '#10B981' : '#F59E0B'}`
                        }}
                    >
                        <Box sx={{ color: 'text.secondary', cursor: 'grab', '&:active': { cursor: 'grabbing' }, display: 'flex', alignItems: 'center' }}>
                            <DragIndicatorIcon />
                        </Box>

                        <Box>
                            <Stack direction="row" alignItems="center" spacing={2} mb={0.5}>
                                <Typography fontWeight={700} variant="h6">{p.title}</Typography>
                                <Chip
                                    size="small"
                                    label={p.status}
                                    color={p.status === 'published' ? 'success' : 'warning'}
                                    variant="outlined"
                                />
                                {p.is_featured && (
                                    <Chip size="small" label="Featured" color="primary" />
                                )}
                            </Stack>
                            <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 1, overflow: 'hidden' }}>
                                {p.summary}
                            </Typography>
                        </Box>

                        <Stack direction="row" spacing={1}>
                            <IconButton onClick={() => handleEdit(p.id)} color="primary">
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(p.id, p.title)} color="error">
                                <DeleteIcon />
                            </IconButton>
                        </Stack>
                    </Paper>
                ))}
            </Stack>

            {items?.length === 0 && (
                <Box textAlign="center" py={8} color="text.secondary">
                    No projects found. Create your first project!
                </Box>
            )}
        </Box>
    )
} 