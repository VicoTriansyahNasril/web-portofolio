import { useEffect, useState } from 'react';
import { Box, Button, Paper, Stack, Typography, CircularProgress, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { experienceAPI } from '@/features/experiences/api/experienceAPI';
import { Experience } from '@/features/experiences/types';
import ExperienceFormModal from '@/features/experiences/components/ExperienceFormModal';
import { confirm, alert } from '@/utils/confirm';

const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

export default function AdminExperiences() {
    const [items, setItems] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Experience | null>(null);

    const loadItems = async () => {
        try {
            const data = await experienceAPI.getAllAdmin();
            setItems(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { void loadItems() }, []);

    const handleDelete = async (item: Experience) => {
        const res = await confirm({ title: `Delete "${item.title}"?` });
        if (res.isConfirmed) {
            try {
                await experienceAPI.delete(item.id);
                await alert({ title: 'Success', text: 'Deleted successfully.' });
                await loadItems();
            } catch {
                await alert({ title: 'Error', icon: 'error', text: 'Failed to delete.' });
            }
        }
    };

    const handleSubmit = async (values: Partial<Experience>) => {
        try {
            if (editingItem) {
                await experienceAPI.update(editingItem.id, values);
            } else {
                await experienceAPI.create(values);
            }
            setIsModalOpen(false);
            setEditingItem(null);
            await alert({ title: 'Success', text: 'Saved successfully.' });
            await loadItems();
        } catch {
            await alert({ title: 'Error', icon: 'error', text: 'Failed to save.' });
        }
    };

    if (loading) return <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 400 }}><CircularProgress /></Box>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Box sx={{ maxWidth: 980, mx: 'auto' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                    <Typography variant="h5" fontWeight={800}>Manage Experiences</Typography>
                    <Button startIcon={<AddIcon />} variant="contained" onClick={() => { setEditingItem(null); setIsModalOpen(true) }}>Add</Button>
                </Stack>
                <Stack spacing={2}>
                    {items.map(item => (
                        <Paper key={item.id} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" fontWeight={600}>{item.title}</Typography>
                                <Typography variant="body1" color="text.secondary">{item.entity_name}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {formatDate(item.start_date)} - {item.end_date ? formatDate(item.end_date) : 'Present'}
                                </Typography>
                            </Box>
                            <Stack direction="row" spacing={1}>
                                <IconButton onClick={() => { setEditingItem(item); setIsModalOpen(true) }}><EditIcon /></IconButton>
                                <IconButton color="error" onClick={() => void handleDelete(item)}><DeleteIcon /></IconButton>
                            </Stack>
                        </Paper>
                    ))}
                </Stack>
            </Box>
            <ExperienceFormModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} initialData={editingItem} />
        </motion.div>
    );
}