import { useEffect, useState } from 'react';
import { Box, Button, Stack, Typography, CircularProgress, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { skillAPI } from '@/features/skills/api/skillAPI';
import { Skill, SkillCreateDTO } from '@/features/skills/types';
import SkillFormModal from '@/features/skills/components/SkillFormModal';
import SortableList from '@/components/ui/SortableList';
import { confirm, alert } from '@/utils/confirm';

export default function AdminSkills() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

    const loadSkills = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await skillAPI.getAllAdmin();
            setSkills(data);
        } catch {
            setError('Failed to load skills.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { void loadSkills() }, []);

    const handleOpenModal = (skill: Skill | null = null) => { setEditingSkill(skill); setIsModalOpen(true); };
    const handleCloseModal = () => { setEditingSkill(null); setIsModalOpen(false); };

    const handleDelete = async (skill: Skill) => {
        const res = await confirm({ title: `Delete "${skill.name}"?` });
        if (res.isConfirmed) {
            try {
                await skillAPI.delete(skill.id);
                await alert({ title: 'Success', text: 'Skill deleted successfully.' });
                await loadSkills();
            } catch {
                await alert({ title: 'Error', icon: 'error', text: 'Failed to delete skill.' });
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
            await alert({ title: 'Success', text: 'Skill saved successfully.' });
            await loadSkills();
        } catch {
            await alert({ title: 'Error', icon: 'error', text: 'Failed to save skill.' });
        }
    };

    const handleReorder = async (newOrder: Skill[]) => {
        setSkills(newOrder);
        try {
            const payload = newOrder.map((item, index) => ({ id: item.id, sort_order: index }));
            await skillAPI.reorder(payload);
        } catch {
            await alert({ title: 'Error', icon: 'error', text: 'Failed to save order.' });
            await loadSkills();
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
            
            <SortableList
                items={skills}
                getId={(s) => s.id}
                onReorder={handleReorder}
                onEdit={handleOpenModal}
                onDelete={(s) => void handleDelete(s)}
                renderItem={(skill) => (
                    <>
                        <Typography variant="h6" fontWeight={600}>{skill.name}</Typography>
                        <Typography variant="body1" color="text.secondary">{skill.group}</Typography>
                    </>
                )}
            />

            <SkillFormModal open={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmit} initialData={editingSkill} />
        </Box>
    );
}