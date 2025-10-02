/* eslint-disable no-unused-vars */
// src/pages/admin/AdminAchievements.jsx
import { useEffect, useState } from 'react';
import { Box, Button, Paper, Stack, Typography, CircularProgress, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchAdminAchievements, createAdminAchievement, updateAdminAchievement, deleteAdminAchievement } from '../../api/achievements';
import { confirm, alert } from '../../utils/confirm';
import AchievementFormModal from '../../components/admin/AchievementFormModal';

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });

export default function AdminAchievements() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const loadItems = async () => {
        try {
            const data = await fetchAdminAchievements();
            setItems(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadItems() }, []);

    const handleOpenModal = (item = null) => { setEditingItem(item); setIsModalOpen(true); };
    const handleCloseModal = () => { setEditingItem(null); setIsModalOpen(false); };

    const handleDelete = async (item) => {
        const res = await confirm({ title: `Hapus "${item.title}"?` });
        if (res.isConfirmed) {
            try {
                await deleteAdminAchievement(item.id);
                alert({ title: 'Sukses', text: 'Data berhasil dihapus.' });
                loadItems();
            } catch (_e) {
                alert({ title: 'Error', icon: 'error', text: 'Gagal menghapus data.' });
            }
        }
    };

    const handleSubmit = async (values) => {
        try {
            if (editingItem) {
                await updateAdminAchievement(editingItem.id, { ...editingItem, ...values });
            } else {
                await createAdminAchievement(values);
            }
            handleCloseModal();
            alert({ title: 'Sukses', text: 'Data berhasil disimpan.' });
            loadItems();
        } catch (_e) {
            alert({ title: 'Error', icon: 'error', text: 'Gagal menyimpan data.' });
        }
    };

    if (loading) return <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 400 }}><CircularProgress /></Box>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Box sx={{ maxWidth: 980, mx: 'auto' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                    <Typography variant="h5" fontWeight={800}>Kelola Pencapaian</Typography>
                    <Button startIcon={<AddIcon />} variant="contained" onClick={() => handleOpenModal()}>Tambah</Button>
                </Stack>
                <Stack spacing={2}>
                    {items.map(item => (
                        <Paper key={item.id} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" fontWeight={600}>{item.title}</Typography>
                                <Typography variant="body1" color="text.secondary">{item.issuer}</Typography>
                                <Typography variant="caption" color="text.secondary">{formatDate(item.date)}</Typography>
                            </Box>
                            <Stack direction="row" spacing={1}>
                                <IconButton onClick={() => handleOpenModal(item)}><EditIcon /></IconButton>
                                <IconButton color="error" onClick={() => handleDelete(item)}><DeleteIcon /></IconButton>
                            </Stack>
                        </Paper>
                    ))}
                </Stack>
            </Box>
            <AchievementFormModal open={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmit} initialData={editingItem} />
        </motion.div>
    );
}