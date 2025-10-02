/* eslint-disable no-unused-vars */
// src/pages/admin/AdminProfile.jsx
import { useEffect, useState, useMemo } from 'react'
import { Paper, Stack, Typography, TextField, Button, Grid, CircularProgress, Box, Divider } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { motion } from 'framer-motion'
import { fetchAdminProfile, upsertAdminProfile } from '../../api/profile'
import { fetchAdminSkills } from '../../api/skills'
import UploadButton from '../../components/admin/UploadButton'
import SocialLinksManager from '../../components/admin/SocialLinksManager'
import SkillGroupOrderManager from '../../components/admin/SkillGroupOrderManager'
import { alert } from '../../utils/confirm'

const validationSchema = Yup.object({
    full_name: Yup.string().required('Nama lengkap wajib diisi'),
    headline: Yup.string().required('Headline wajib diisi'),
});

export default function AdminProfile() {
    const [loading, setLoading] = useState(true);
    const [allSkills, setAllSkills] = useState([]);

    const formik = useFormik({
        initialValues: {
            full_name: '', headline: '', bio: '', photo_url: '',
            location: '', resume_url: '', socials: [], skill_group_order: '[]',
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await upsertAdminProfile(values);
                alert({ title: 'Sukses', text: 'Profil berhasil diperbarui.', icon: 'success' });
            } catch (_error) {
                alert({ title: 'Error', text: 'Gagal menyimpan profil.', icon: 'error' });
            } finally {
                setSubmitting(false);
            }
        },
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [profileData, skillsData] = await Promise.all([
                    fetchAdminProfile(),
                    fetchAdminSkills()
                ]);

                if (profileData) {
                    formik.setValues({
                        full_name: profileData.full_name || '',
                        headline: profileData.headline || '',
                        bio: profileData.bio || '',
                        photo_url: profileData.photo_url || '',
                        location: profileData.location || '',
                        resume_url: profileData.resume_url || '',
                        socials: profileData.socials || [],
                        skill_group_order: profileData.skill_group_order || '[]',
                    }, false);
                }
                setAllSkills(skillsData);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []); // eslint-disable-line

    const availableGroups = useMemo(() => {
        return [...new Set(allSkills.map(s => s.group).filter(Boolean))];
    }, [allSkills]);

    const currentOrder = useMemo(() => {
        try { return JSON.parse(formik.values.skill_group_order) } catch { return [] }
    }, [formik.values.skill_group_order]);

    if (loading) {
        return <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 400 }}><CircularProgress /></Box>;
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Paper sx={{ p: { xs: 2, md: 4 }, maxWidth: 980, mx: 'auto' }}>
                <form onSubmit={formik.handleSubmit}>
                    <Stack spacing={4}>
                        <Typography variant="h5" fontWeight={800}>Kelola Profil</Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Stack spacing={3}>
                                    <TextField name="full_name" label="Nama Lengkap" {...formik.getFieldProps('full_name')} error={formik.touched.full_name && !!formik.errors.full_name} helperText={formik.touched.full_name && formik.errors.full_name} fullWidth />
                                    <TextField name="headline" label="Headline" {...formik.getFieldProps('headline')} error={formik.touched.headline && !!formik.errors.headline} helperText={formik.touched.headline && formik.errors.headline} fullWidth />
                                    <TextField name="location" label="Lokasi" {...formik.getFieldProps('location')} fullWidth />
                                    <TextField name="bio" label="Bio / Tentang Saya" {...formik.getFieldProps('bio')} multiline rows={6} fullWidth />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Stack spacing={3}>
                                    <Stack spacing={1}><Typography variant="subtitle1" fontWeight={600}>Foto Profil</Typography><TextField size="small" name="photo_url" label="URL Foto Profil" {...formik.getFieldProps('photo_url')} /><UploadButton label="Unggah Foto Baru" onUploaded={(url) => formik.setFieldValue('photo_url', url)} /></Stack>
                                    <Stack spacing={1}><Typography variant="subtitle1" fontWeight={600}>File CV</Typography><TextField size="small" name="resume_url" label="URL File CV" {...formik.getFieldProps('resume_url')} /><UploadButton label="Unggah CV Baru" onUploaded={(url) => formik.setFieldValue('resume_url', url)} /></Stack>
                                </Stack>
                            </Grid>
                            <Grid item xs={12}><Divider /></Grid>
                            <Grid item xs={12} md={6}>
                                <SocialLinksManager links={formik.values.socials} onChange={(newSocials) => formik.setFieldValue('socials', newSocials)} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <SkillGroupOrderManager
                                    availableGroups={availableGroups}
                                    currentOrder={currentOrder}
                                    onOrderChange={(newOrder) => formik.setFieldValue('skill_group_order', JSON.stringify(newOrder))}
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                            <Button type="submit" variant="contained" disabled={formik.isSubmitting}>{formik.isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}</Button>
                        </Box>
                    </Stack>
                </form>
            </Paper>
        </motion.div>
    );
}