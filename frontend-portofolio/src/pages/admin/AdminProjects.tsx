import { Box, Button, Chip, Stack, Typography, CircularProgress, Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import useSWR from 'swr'
import { projectAPI } from '@/features/projects/api/projectAPI'
import { Project } from '@/features/projects/types'
import { alert, confirm } from '@/utils/confirm'
import SortableList from '@/components/ui/SortableList'

export default function AdminProjects() {
    const navigate = useNavigate()
    const { data: items, error, isLoading, mutate } = useSWR<Project[]>('/api/admin/projects', projectAPI.getAllAdmin)

    const handleNew = () => navigate('/admin/projects/new')
    const handleEdit = (project: Project) => navigate(`/admin/projects/${project.id}`)

    const handleDelete = async (project: Project) => {
        const res = await confirm({ title: `Delete "${project.title}"?`, text: 'This action cannot be undone.' })
        if (res.isConfirmed) {
            const optimisticData = items?.filter((p) => p.id !== project.id)
            await mutate(optimisticData, false)
            try {
                await projectAPI.delete(project.id)
                await alert({ title: 'Deleted', text: 'Project deleted successfully.' })
                await mutate()
            } catch (err) {
                console.error(err)
                await mutate(items, false)
                await alert({ title: 'Error', text: 'Failed to delete project.', icon: 'error' })
            }
        }
    }

    const handleReorder = async (newOrder: Project[]) => {
        const originalOrder = items ? [...items] : []
        await mutate(newOrder, false)
        try {
            const reorderPayload = newOrder.map((p, i) => ({ id: p.id, sort_order: i }))
            await projectAPI.reorder(reorderPayload)
        } catch {
            await alert({ title: 'Error', text: 'Failed to save order.', icon: 'error' })
            await mutate(originalOrder, false)
        }
    }

    if (isLoading) return <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 400 }}><CircularProgress /></Box>
    if (error) return <Alert severity="error">Failed to load projects.</Alert>

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight={800}>Manage Projects</Typography>
                <Button startIcon={<AddIcon />} variant="contained" onClick={() => handleNew()}>
                    New Project
                </Button>
            </Stack>

            {items?.length === 0 ? (
                <Box textAlign="center" py={8} color="text.secondary">
                    No projects found. Create your first project!
                </Box>
            ) : (
                <SortableList
                    items={items || []}
                    getId={(p) => p.id}
                    onReorder={handleReorder}
                    onEdit={(p) => handleEdit(p)}
                    onDelete={(p) => void handleDelete(p)}
                    renderItem={(p) => (
                        <Box sx={{ borderLeft: `4px solid ${p.status === 'published' ? '#10B981' : '#F59E0B'}`, pl: 2, ml: -2 }}>
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
                    )}
                />
            )}
        </Box>
    )
} 