/* eslint-disable no-unused-vars */
// src/pages/admin/AdminSkills.jsx
import { useEffect, useState, useRef, useMemo } from 'react';
import { Box, Button, Paper, Stack, Typography, CircularProgress, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { fetchAdminSkills, createAdminSkill, updateAdminSkill, deleteAdminSkill, reorderAdminSkills } from '../../api/skills';
import { confirm, alert } from '../../utils/confirm';
import SkillFormModal from '../../components/admin/SkillFormModal';

function SkillItem({ skill, onEdit, onDelete, ...dragProps }) {
    return (
        <Paper
            {...dragProps}
            sx={{
                p: 2, display: 'flex', alignItems: 'center', gap: 1,
                cursor: 'grab',
            }}
        >
            <DragIndicatorIcon sx={{ color: 'text.secondary' }} />
            <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight={600}>{skill.name}</Typography>
                <Typography variant="body2" color="text.secondary">Grup: {skill.group}</Typography>
            </Box>
            <Stack direction="row" spacing={1}>
                <IconButton onClick={onEdit}><EditIcon /></IconButton>
                <IconButton color="error" onClick={onDelete}><DeleteIcon /></IconButton>
            </Stack>
        </Paper>
    );
}

export default function AdminSkills() {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState(null);
    const dragItemRef = useRef(null);
    const dragOverItemRef = useRef(null);

    const loadSkills = async () => {
        try {
            const data = await fetchAdminSkills();
            setSkills(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadSkills() }, []);

    const groupedSkills = useMemo(() => {
        return skills.reduce((acc, skill) => {
            const group = skill.group || 'Lainnya';
            if (!acc[group]) acc[group] = [];
            acc[group].push(skill);
            return acc;
        }, {});
    }, [skills]);

    const handleOpenModal = (skill = null) => { setEditingSkill(skill); setIsModalOpen(true); };
    const handleCloseModal = () => { setEditingSkill(null); setIsModalOpen(false); };

    const handleDelete = async (skill) => {
        const res = await confirm({ title: `Hapus skill "${skill.name}"?` });
        if (res.isConfirmed) {
            try {
                await deleteAdminSkill(skill.id);
                alert({ title: 'Sukses', text: 'Skill berhasil dihapus.' });
                loadSkills();
            } catch (_e) {
                alert({ title: 'Error', icon: 'error', text: 'Gagal menghapus skill.' });
            }
        }
    };

    const handleSubmit = async (values) => {
        try {
            if (editingSkill) {
                await updateAdminSkill(editingSkill.id, values);
            } else {
                await createAdminSkill(values);
            }
            handleCloseModal();
            alert({ title: 'Sukses', text: 'Data skill berhasil disimpan.' });
            loadSkills();
        } catch (_e) {
            alert({ title: 'Error', icon: 'error', text: 'Gagal menyimpan data skill.' });
        }
    };

    const handleDragEnd = async () => {
        if (dragItemRef.current === null || dragOverItemRef.current === null) return;
        const originalSkills = [...skills];
        const fromIndex = dragItemRef.current;
        const toIndex = dragOverItemRef.current;
        dragItemRef.current = null;
        dragOverItemRef.current = null;
        if (fromIndex === toIndex) return;

        const movedItem = originalSkills.splice(fromIndex, 1)[0];
        originalSkills.splice(toIndex, 0, movedItem);
        setSkills(originalSkills); // Optimistic update

        try {
            const payload = originalSkills.map((s, i) => ({ id: s.id, sort_order: i }));
            await reorderAdminSkills(payload);
        } catch (error) {
            alert({ title: 'Error', text: 'Gagal menyimpan urutan baru.', icon: 'error' });
            setSkills(skills); // Rollback
        }
    };

    if (loading) return <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 400 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ maxWidth: 980, mx: 'auto' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight={800}>Kelola Skills</Typography>
                <Button startIcon={<AddIcon />} variant="contained" onClick={() => handleOpenModal()}>Tambah Skill</Button>
            </Stack>

            {Object.entries(groupedSkills).map(([group, groupSkills]) => (
                <Box key={group} sx={{ mb: 4 }}>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2, borderBottom: 1, borderColor: 'divider', pb: 1 }}>
                        {group}
                    </Typography>
                    <Stack spacing={1}>
                        {groupSkills.map((skill) => {
                            const currentIndex = skills.findIndex(s => s.id === skill.id);
                            return (
                                <SkillItem
                                    key={skill.id}
                                    skill={skill}
                                    onEdit={() => handleOpenModal(skill)}
                                    onDelete={() => handleDelete(skill)}
                                    draggable
                                    onDragStart={() => (dragItemRef.current = currentIndex)}
                                    onDragEnter={() => (dragOverItemRef.current = currentIndex)}
                                    onDragEnd={handleDragEnd}
                                    onDragOver={(e) => e.preventDefault()}
                                />
                            );
                        })}
                    </Stack>
                </Box>
            ))}

            <SkillFormModal open={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmit} initialData={editingSkill} />
        </Box>
    );
}