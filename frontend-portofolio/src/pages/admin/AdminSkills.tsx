import { useEffect, useState } from 'react';
import { Box, Button, Paper, Stack, Typography, CircularProgress, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { fetchAdminSkills, createAdminSkill, updateAdminSkill, deleteAdminSkill, reorderAdminSkills } from '../../api/skills';
import { confirm, alert } from '../../utils/confirm';
import SkillFormModal from '../../components/admin/SkillFormModal';
import { Skill } from '../../types';

interface SortableItemProps {
    skill: Skill;
    onEdit: (skill: Skill) => void;
    onDelete: (skill: Skill) => void;
}

function SortableItem({ skill, onEdit, onDelete }: SortableItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: skill.id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
        <Paper ref={setNodeRef} style={style} sx={{ p: 2, display: 'flex', alignItems: 'center', touchAction: 'none' }}>
            <Box {...attributes} {...listeners} sx={{ cursor: 'grab', color: 'text.secondary', mr: 1.5 }}>
                <DragIndicatorIcon />
            </Box>
            <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight={600}>{skill.name}</Typography>
                <Typography variant="body1" color="text.secondary">{skill.group}</Typography>
            </Box>
            <Stack direction="row" spacing={1}>
                <IconButton onClick={() => onEdit(skill)}><EditIcon /></IconButton>
                <IconButton color="error" onClick={() => onDelete(skill)}><DeleteIcon /></IconButton>
            </Stack>
        </Paper>
    );
}

export default function AdminSkills() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const loadSkills = async () => {
        setLoading(true);
        try {
            const data = await fetchAdminSkills();
            setSkills(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadSkills() }, []);

    const handleOpenModal = (skill: Skill | null = null) => { setEditingSkill(skill); setIsModalOpen(true); };
    const handleCloseModal = () => { setEditingSkill(null); setIsModalOpen(false); };

    const handleDelete = async (skill: Skill) => {
        const res = await confirm({ title: `Hapus "${skill.name}"?` });
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

    const handleSubmit = async (values: Partial<Omit<Skill, 'id' | 'created_at' | 'updated_at'>>) => {
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

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = skills.findIndex(item => item.id === active.id);
            const newIndex = skills.findIndex(item => item.id === over.id);
            const newOrder = arrayMove(skills, oldIndex, newIndex);
            setSkills(newOrder);

            try {
                const payload = newOrder.map((item, index) => ({ id: item.id, order_index: index }));
                await reorderAdminSkills(payload);
            } catch (error) {
                alert({ title: 'Error', icon: 'error', text: 'Gagal menyimpan urutan baru.' });
                loadSkills();
            }
        }
    };

    if (loading) return <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 400 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ maxWidth: 980, mx: 'auto' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight={800}>Kelola Skills</Typography>
                <Button startIcon={<AddIcon />} variant="contained" onClick={() => handleOpenModal()}>Tambah Skill</Button>
            </Stack>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={skills.map(s => s.id)} strategy={verticalListSortingStrategy}>
                    <Stack spacing={2}>
                        {skills.map(skill => (
                            <SortableItem key={skill.id} skill={skill} onEdit={handleOpenModal} onDelete={handleDelete} />
                        ))}
                    </Stack>
                </SortableContext>
            </DndContext>

            <SkillFormModal open={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmit} initialData={editingSkill} />
        </Box>
    );
}