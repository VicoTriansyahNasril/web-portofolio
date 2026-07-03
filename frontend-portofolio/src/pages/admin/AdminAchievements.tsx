import { useEffect, useState } from 'react'
import { Box, Button, Paper, Stack, Typography, CircularProgress } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { achievementAPI } from '@/features/achievements/api/achievementAPI'
import { Achievement, AchievementDTO } from '@/features/achievements/types'
import AchievementFormModal from '@/features/achievements/components/AchievementFormModal'
import SortableList from '@/components/ui/SortableList'
import { confirm, alert } from '@/utils/confirm'

const formatDate = (dateStr: string) => {
    try {
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    } catch {
        return dateStr
    }
}

export default function AdminAchievements() {
    const [items, setItems] = useState<Achievement[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<Achievement | null>(null)

    const loadItems = async () => {
        setLoading(true)
        try {
            const data = await achievementAPI.getAllAdmin()
            setItems(data)
        } catch (err) {
            console.error(err)
            await alert({ title: 'Error', text: 'Failed to load achievements.', icon: 'error' })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { void loadItems() }, [])

    const handleDelete = async (item: Achievement) => {
        const res = await confirm({ title: `Delete "${item.title}"?` })
        if (res.isConfirmed) {
            try {
                await achievementAPI.delete(item.id)
                await alert({ title: 'Success', text: 'Deleted successfully.' })
                await loadItems()
            } catch {
                await alert({ title: 'Error', icon: 'error', text: 'Failed to delete.' })
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
            await alert({ title: 'Success', text: 'Saved successfully.' })
            await loadItems()
        } catch {
            await alert({ title: 'Error', icon: 'error', text: 'Failed to save.' })
        }
    }

    const handleReorder = async (newOrder: Achievement[]) => {
        setItems(newOrder)
        try {
            await achievementAPI.reorder(newOrder.map((item, index) => ({ id: item.id, sort_order: index })))
        } catch {
            await loadItems()
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

            <SortableList
                items={items}
                getId={(i) => i.id}
                onReorder={handleReorder}
                onEdit={(i) => { setEditingItem(i); setIsModalOpen(true) }}
                onDelete={(i) => void handleDelete(i)}
                renderItem={(item) => (
                    <>
                        <Typography variant="h6" fontWeight={600}>{item.title}</Typography>
                        <Typography variant="body1" color="text.secondary">{item.issuer}</Typography>
                        <Typography variant="caption" color="text.secondary">{formatDate(item.date)}</Typography>
                    </>
                )}
            />

            <AchievementFormModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} initialData={editingItem} />
        </Box>
    )
}