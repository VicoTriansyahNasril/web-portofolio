import { useEffect, useState } from 'react';
import { Box, Button, Paper, Stack, Typography, CircularProgress, IconButton, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { skillAPI } from '@/features/skills/api/skillAPI';
import { Skill, SkillCreateDTO } from '@/features/skills/types';
import SkillFormModal from '@/features/skills/components/SkillFormModal';
import { confirm, alert } from '@/utils/confirm';

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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const loadSkills = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await skillAPI.getAllAdmin();
            setSkills(data);
        } catch (err) {
            setError('Failed to load skills.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadSkills() }, []);

    const handleOpenModal = (skill: Skill | null = null) => { setEditingSkill(skill); setIsModalOpen(true); };
    const handleCloseModal = () => { setEditingSkill(null); setIsModalOpen(false); };

    const handleDelete = async (skill: Skill) => {
        const res = await confirm({ title: `Delete "${skill.name}"?` });
        if (res.isConfirmed) {
            try {
                await skillAPI.delete(skill.id);
                alert({ title: 'Success', text: 'Skill deleted successfully.' });
                loadSkills();
            } catch {
                alert({ title: 'Error', icon: 'error', text: 'Failed to delete skill.' });
            }
        }
    };

    const handleSubmit = async (values: Partial<Skill>) => {
        if (!values.name || !values.group) return;

        const payload: SkillCreateDTO = {
            name: values.name,
            group: values.group
        };

        try {
            if (editingSkill) {
                await skillAPI.update(editingSkill.id, payload);
            } else {
                await skillAPI.create(payload);
            }
            handleCloseModal();
            alert({ title: 'Success', text: 'Skill saved successfully.' });
            loadSkills();
        } catch {
            alert({ title: 'Error', icon: 'error', text: 'Failed to save skill.' });
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
                const payload = newOrder.map((item, index) => ({ id: item.id, sort_order: index }));
                await skillAPI.reorder(payload);
            } catch {
                alert({ title: 'Error', icon: 'error', text: 'Failed to save order.' });
                loadSkills();
            }
        }
    };

    if (loading) return <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 400 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ maxWidth: 980, mx: 'auto' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight={800}>Manage Skills</Typography>
                <Button startIcon={<AddIcon />} variant="contained" onClick={() => handleOpenModal()}>Add Skill</Button>
            </Stack>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
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