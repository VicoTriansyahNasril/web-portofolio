import { useEffect, useMemo, useState } from 'react';
import { Paper, Stack, Typography, TextField, CircularProgress, Box, Divider } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { updateAdminProfile, fetchPublicProfile } from '../../api/profile';
import { fetchAdminSkills } from '../../api/skills';
import UploadButton from '../../components/admin/UploadButton';
import SocialLinksManager from '../../components/admin/SocialLinksManager';
import SkillGroupOrderManager, { SkillGroup } from '../../components/admin/SkillGroupOrderManager';
import { alert } from '../../utils/confirm';
import { Profile, Skill, Social } from '../../types';

type ProfileFormValues = Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;

const validationSchema = Yup.object({
    full_name: Yup.string().required('Nama lengkap wajib diisi'),
    headline: Yup.string().required('Headline wajib diisi')
});

export default function AdminProfile() {
    const [loading, setLoading] = useState<boolean>(true);
    const [allSkills, setAllSkills] = useState<Skill[]>([]);

    const formik = useFormik<ProfileFormValues>({
        initialValues: {
            full_name: '',
            headline: '',
            bio: '',
            photo_url: '',
            location: '',
            resume_url: '',
            socials: [],
            skill_group_order: '[]'
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await updateAdminProfile(values);
                alert({ title: 'Sukses', text: 'Profil berhasil diperbarui.', icon: 'success' });
            } catch {
                alert({ title: 'Error', text: 'Gagal menyimpan profil.', icon: 'error' });
            } finally {
                setSubmitting(false);
            }
        },
        enableReinitialize: true,
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [profileData, skillsData] = await Promise.all([fetchPublicProfile(), fetchAdminSkills()]);
                if (profileData) {
                    formik.setValues(profileData);
                }
                setAllSkills(skillsData || []);
            } finally {
                setLoading(false);
            }
        };
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const skillGroups = useMemo<SkillGroup[]>(() => {
        const groupNames = Array.from(new Set(allSkills.map(s => s.group).filter(Boolean)));
        let order: string[] = [];
        try {
            order = JSON.parse(formik.values.skill_group_order || '[]');
        } catch { /* ignore parse error */ }

        const ordered = groupNames
            .map((name) => ({ category: name, order: order.indexOf(name) === -1 ? Infinity : order.indexOf(name) }))
            .sort((a, b) => a.order - b.order)
            .map((g, index) => ({ ...g, order: index + 1 }));

        return ordered;
    }, [allSkills, formik.values.skill_group_order]);

    if (loading) {
        return <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 400 }}><CircularProgress /></Box>;
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Paper sx={{ p: { xs: 2, md: 4 }, maxWidth: 980, mx: 'auto' }}>
                <form onSubmit={formik.handleSubmit}>
                    <Stack spacing={4}>
                        <Typography variant="h5" fontWeight={800}>Kelola Profil</Typography>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2">
                                <Stack spacing={3}>
                                    <TextField {...formik.getFieldProps('full_name')} label="Nama Lengkap" error={formik.touched.full_name && !!formik.errors.full_name} helperText={formik.touched.full_name && formik.errors.full_name} fullWidth />
                                    <TextField {...formik.getFieldProps('headline')} label="Headline" error={formik.touched.headline && !!formik.errors.headline} helperText={formik.touched.headline && formik.errors.headline} fullWidth />
                                    <TextField {...formik.getFieldProps('location')} label="Lokasi" fullWidth />
                                    <TextField {...formik.getFieldProps('bio')} label="Bio / Tentang Saya" multiline rows={6} fullWidth />
                                </Stack>
                            </div>
                            <div className="md:col-span-1">
                                <Stack spacing={3}>
                                    <Stack spacing={1}>
                                        <Typography variant="subtitle1" fontWeight={600}>Foto Profil</Typography>
                                        <TextField size="small" label="URL Foto Profil" {...formik.getFieldProps('photo_url')} />
                                        <UploadButton label="Unggah Foto Baru" onUploaded={(url) => formik.setFieldValue('photo_url', url as string)} />
                                    </Stack>
                                    <Stack spacing={1}>
                                        <Typography variant="subtitle1" fontWeight={600}>File CV</Typography>
                                        <TextField size="small" label="URL File CV" {...formik.getFieldProps('resume_url')} />
                                        <UploadButton label="Unggah CV Baru" onUploaded={(url) => formik.setFieldValue('resume_url', url as string)} />
                                    </Stack>
                                </Stack>
                            </div>
                            <div className="md:col-span-3"><Divider /></div>
                            <div className="md:col-span-2">
                                <SocialLinksManager
                                    links={formik.values.socials || []}
                                    onUpdate={(v: Social[]) => formik.setFieldValue('socials', v)}
                                    onSubmit={formik.submitForm}
                                    isSubmitting={formik.isSubmitting}
                                />
                            </div>
                            <div className="md:col-span-1">
                                <SkillGroupOrderManager
                                    groups={skillGroups}
                                    onReorder={async (updatedGroups) => {
                                        const newOrder = updatedGroups.map(g => g.category);
                                        await formik.setFieldValue('skill_group_order', JSON.stringify(newOrder));
                                    }}
                                />
                            </div>
                        </div>
                    </Stack>
                </form>
            </Paper>
        </motion.div>
    );
}