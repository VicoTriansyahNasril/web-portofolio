import { useEffect, useState } from 'react'
import { Box, Button, Paper, Stack, Typography, CircularProgress, IconButton, Alert } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import {
    DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core'
import {
    arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { fetchAdminAchievements, createAdminAchievement, updateAdminAchievement, deleteAdminAchievement, reorderAdminAchievements } from '../../api/achievements'
import { confirm, alert } from '../../utils/confirm'
import AchievementFormModal from '../../components/admin/AchievementFormModal'
import { Achievement } from '../../types'

const formatDate = (dateStr: string) => {
    try {
        return new Date(dateStr).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })
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
    const {
        attributes, listeners, setNodeRef, transform, transition,
    } = useSortable({ id: item.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

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
    const [error, setError] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<Achievement | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    const loadItems = async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await fetchAdminAchievements()
            setItems(data)
        } catch (err) {
            setError('Gagal memuat data pencapaian')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadItems() }, [])

    const handleOpenModal = (item: Achievement | null = null) => {
        setEditingItem(item)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setEditingItem(null)
        setIsModalOpen(false)
    }

    const handleDelete = async (item: Achievement) => {
        const res = await confirm({ title: `Hapus "${item.title}"?` })
        if (res.isConfirmed) {
            try {
                await deleteAdminAchievement(item.id)
                alert({ title: 'Sukses', text: 'Data berhasil dihapus.' })
                loadItems()
            } catch (err) {
                console.error(err)
                alert({ title: 'Error', icon: 'error', text: 'Gagal menghapus data.' })
            }
        }
    }

    const handleSubmit = async (values: Partial<Omit<Achievement, 'id' | 'created_at' | 'updated_at'>>) => {
        try {
            if (editingItem) {
                await updateAdminAchievement(editingItem.id, values)
            } else {
                await createAdminAchievement(values)
            }
            handleCloseModal()
            alert({ title: 'Sukses', text: 'Data berhasil disimpan.' })
            loadItems()
        } catch (err) {
            console.error(err)
            alert({ title: 'Error', icon: 'error', text: 'Gagal menyimpan data. Pastikan semua field terisi dengan benar.' })
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
                const payload = newOrder.map((item, index) => ({ id: item.id, sort_order: index }))
                await reorderAdminAchievements(payload)
            } catch (err) {
                console.error(err)
                alert({ title: 'Error', icon: 'error', text: 'Gagal menyimpan urutan baru.' })
                loadItems()
            }
        }
    }

    if (loading) {
        return (
            <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 400 }}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box sx={{ maxWidth: 980, mx: 'auto' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight={800}>Kelola Pencapaian</Typography>
                <Button startIcon={<AddIcon />} variant="contained" onClick={() => handleOpenModal()}>
                    Tambah
                </Button>
            </Stack>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {items.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                        Belum ada data pencapaian. Klik tombol "Tambah" untuk menambahkan data baru.
                    </Typography>
                </Paper>
            ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                        <Stack spacing={2}>
                            {items.map(item => (
                                <SortableItem key={item.id} item={item} onEdit={handleOpenModal} onDelete={handleDelete} />
                            ))}
                        </Stack>
                    </SortableContext>
                </DndContext>
            )}

            <AchievementFormModal open={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmit} initialData={editingItem} />
        </Box>
    )
}