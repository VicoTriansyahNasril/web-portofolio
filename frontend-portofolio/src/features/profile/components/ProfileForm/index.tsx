import { useEffect, useState, useMemo } from 'react';
import { Paper, Stack, Typography, TextField, CircularProgress, Box, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import UploadButton from '@/components/ui/UploadButton';
import SocialLinksManager from '../SocialLinksManager';
import SkillGroupOrderManager, { SkillGroup } from '../SkillGroupOrderManager';
import { useProfileForm } from '@/features/profile/hooks/useProfileForm';
import { skillAPI } from '@/features/skills/api/skillAPI';
import { Profile } from '../../types';

interface ProfileFormProps {
    initialData: Profile | null;
    onSubmit: (data: Partial<Profile>) => Promise<void>;
}

export default function ProfileForm({ initialData, onSubmit }: ProfileFormProps) {
    const {
        formik,
        loading,
        handleSocialChange,
    } = useProfileForm({ initialData, onSubmit });

    const [allSkills, setAllSkills] = useState<any[]>([]);

    useEffect(() => {
        const loadSkills = async () => {
            try {
                const skills = await skillAPI.getAllAdmin();
                setAllSkills(skills);
            } catch (error) {
                console.error("Failed to fetch skills:", error);
            }
        };
        loadSkills();
    }, []);

    const currentSkillGroups = useMemo<SkillGroup[]>(() => {
        const groupNames = Array.from(new Set(allSkills.map(s => s.group).filter(Boolean)));
        let order: string[] = [];

        try {
            order = JSON.parse(formik.values.skill_group_order || '[]');
        } catch { /* ignore */ }

        return groupNames
            .map((name) => ({
                category: name,
                order: order.indexOf(name) !== -1 ? order.indexOf(name) : 999
            }))
            .sort((a, b) => a.order - b.order)
            .map((g, index) => ({ ...g, order: index + 1 }));
    }, [allSkills, formik.values.skill_group_order]);

    const handleReorder = (updatedGroups: SkillGroup[]) => {
        const newOrder = updatedGroups.map(g => g.category);
        formik.setFieldValue('skill_group_order', JSON.stringify(newOrder));
    };

    if (loading && !initialData) {
        return <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 400 }}><CircularProgress /></Box>;
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Paper sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', mb: 4 }}>
                <form onSubmit={formik.handleSubmit}>
                    <Stack spacing={4}>
                        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4">
                            <Typography variant="h5" fontWeight={800}>Manage Profile</Typography>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <Stack spacing={3}>
                                    <TextField
                                        name="full_name"
                                        label="Full Name"
                                        value={formik.values.full_name}
                                        onChange={formik.handleChange}
                                        required
                                        fullWidth
                                    />
                                    <TextField
                                        name="headline"
                                        label="Headline"
                                        value={formik.values.headline}
                                        onChange={formik.handleChange}
                                        required
                                        fullWidth
                                    />
                                    <TextField
                                        name="location"
                                        label="Location"
                                        value={formik.values.location}
                                        onChange={formik.handleChange}
                                        fullWidth
                                    />
                                    <TextField
                                        name="bio"
                                        label="Bio"
                                        value={formik.values.bio}
                                        onChange={formik.handleChange}
                                        multiline
                                        rows={6}
                                        fullWidth
                                    />
                                </Stack>

                                <Divider />

                                <SocialLinksManager
                                    links={formik.values.socials}
                                    onUpdate={handleSocialChange}
                                />
                            </div>

                            <div className="lg:col-span-1 space-y-6">
                                <Paper variant="outlined" sx={{ p: 3, bgcolor: 'background.default' }}>
                                    <Typography variant="h6" gutterBottom>Media</Typography>
                                    <Stack spacing={3}>
                                        <Stack spacing={1}>
                                            <Typography variant="subtitle2">Profile Picture</Typography>
                                            <TextField
                                                size="small"
                                                value={formik.values.photo_url}
                                                onChange={formik.handleChange}
                                                name="photo_url"
                                                placeholder="https://..."
                                                fullWidth
                                            />
                                            <UploadButton
                                                label="Upload Photo"
                                                onUploaded={(url) => formik.setFieldValue('photo_url', url)}
                                                fullWidth
                                            />
                                        </Stack>
                                        <Stack spacing={1}>
                                            <Typography variant="subtitle2">Resume / CV</Typography>
                                            <TextField
                                                size="small"
                                                value={formik.values.resume_url}
                                                onChange={formik.handleChange}
                                                name="resume_url"
                                                placeholder="https://..."
                                                fullWidth
                                            />
                                            <UploadButton
                                                label="Upload Resume"
                                                onUploaded={(url) => formik.setFieldValue('resume_url', url)}
                                                fullWidth
                                            />
                                        </Stack>
                                    </Stack>
                                </Paper>

                                <SkillGroupOrderManager
                                    groups={currentSkillGroups}
                                    onReorder={async (items) => handleReorder(items)}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700 mt-8">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-600/20"
                            >
                                {loading ? 'Saving Changes...' : 'Save All Changes'}
                            </button>
                        </div>
                    </Stack>
                </form>
            </Paper>
        </motion.div>
    );
}