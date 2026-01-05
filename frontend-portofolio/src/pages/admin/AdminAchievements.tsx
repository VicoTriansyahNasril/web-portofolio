import { useEffect, useState } from 'react'
import { Box, Button, Paper, Stack, Typography, CircularProgress, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { achievementAPI } from '@/features/achievements/api/achievementAPI'
import { Achievement, AchievementDTO } from '@/features/achievements/types'
import AchievementFormModal from '@/features/achievements/components/AchievementFormModal'
import { confirm, alert } from '@/utils/confirm'

const formatDate = (dateStr: string) => {
    try {
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    } catch {
        return dateStr
    }
}

interface SortableItemProps {
    item: Achievement
    onEdit: (item: Achievement) => void
    onDelete: (item: Achievement) => void
}

function SortableItem({ item, onEdit, onDelete }: SortableItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id })
    const style = { transform: CSS.Transform.toString(transform), transition }

    return (
        <Paper ref={setNodeRef} style={style} sx={{ p: 2, display: 'flex', alignItems: 'center', touchAction: 'none' }}>
            <Box {...attributes} {...listeners} sx={{ cursor: 'grab', color: 'text.secondary', mr: 1.5 }}>
                <DragIndicatorIcon />
            </Box>
            <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight={600}>{item.title}</Typography>
                <Typography variant="body1" color="text.secondary">{item.issuer}</Typography>
                <Typography variant="caption" color="text.secondary">{formatDate(item.date)}</Typography>
            </Box>
            <Stack direction="row" spacing={1}>
                <IconButton onClick={() => onEdit(item)}><EditIcon /></IconButton>
                <IconButton color="error" onClick={() => onDelete(item)}><DeleteIcon /></IconButton>
            </Stack>
        </Paper>
    )
}

export default function AdminAchievements() {
    const [items, setItems] = useState<Achievement[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<Achievement | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    const loadItems = async () => {
        setLoading(true)
        try {
            const data = await achievementAPI.getAllAdmin()
            setItems(data)
        } catch (err) {
            console.error(err)
            alert({ title: 'Error', text: 'Failed to load achievements.', icon: 'error' })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadItems() }, [])

    const handleDelete = async (item: Achievement) => {
        const res = await confirm({ title: `Delete "${item.title}"?` })
        if (res.isConfirmed) {
            try {
                await achievementAPI.delete(item.id)
                alert({ title: 'Success', text: 'Deleted successfully.' })
                loadItems()
            } catch {
                alert({ title: 'Error', icon: 'error', text: 'Failed to delete.' })
            }
        }
    }

    const handleSubmit = async (values: Partial<Achievement>) => {
        const payload: Partial<AchievementDTO> = {
            title: values.title,
            issuer: values.issuer,
            date: values.date,
            description: values.description,
            credential_url: values.credential_url,
            link_text: values.link_text
        }

        try {
            if (editingItem) {
                await achievementAPI.update(editingItem.id, payload)
            } else {
                await achievementAPI.create(payload)
            }
            setIsModalOpen(false)
            setEditingItem(null)
            alert({ title: 'Success', text: 'Saved successfully.' })
            loadItems()
        } catch {
            alert({ title: 'Error', icon: 'error', text: 'Failed to save.' })
        }
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex(item => item.id === active.id)
            const newIndex = items.findIndex(item => item.id === over.id)
            const newOrder = arrayMove(items, oldIndex, newIndex)
            setItems(newOrder)
            try {
                await achievementAPI.reorder(newOrder.map((item, index) => ({ id: item.id, sort_order: index })))
            } catch {
                loadItems()
            }
        }
    }

    if (loading) return <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 400 }}><CircularProgress /></Box>

    return (
        <Box sx={{ maxWidth: 980, mx: 'auto' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight={800}>Manage Achievements</Typography>
                <Button startIcon={<AddIcon />} variant="contained" onClick={() => { setEditingItem(null); setIsModalOpen(true) }}>Add</Button>
            </Stack>

            {items.length === 0 && (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                        No achievements found. Add your first achievement.
                    </Typography>
                </Paper>
            )}

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                    <Stack spacing={2}>
                        {items.map(item => (
                            <SortableItem key={item.id} item={item} onEdit={(i) => { setEditingItem(i); setIsModalOpen(true) }} onDelete={handleDelete} />
                        ))}
                    </Stack>
                </SortableContext>
            </DndContext>

            <AchievementFormModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} initialData={editingItem} />
        </Box>
    )
}