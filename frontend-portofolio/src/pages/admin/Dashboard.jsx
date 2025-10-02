// src/pages/admin/Dashboard.jsx
import { useEffect, useState } from 'react'
import { Paper, Stack, Typography, Grid, Box, CircularProgress, Button } from '@mui/material'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { Link as RouterLink } from 'react-router-dom'
import ArticleIcon from '@mui/icons-material/Article'
import CodeIcon from '@mui/icons-material/Code'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { getProjectsAdmin } from '../../api/projects'
import { fetchAdminSkills } from '../../api/skills'

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
}

function StatCard({ icon, title, value, color }) {
    return (
        <motion.div variants={itemVariants}>
            <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{
                    width: 56, height: 56, borderRadius: '50%', display: 'grid', placeItems: 'center',
                    bgcolor: `${color}.main`, color: 'white'
                }}>
                    {icon}
                </Box>
                <Box>
                    <Typography color="text.secondary">{title}</Typography>
                    <Typography variant="h4" fontWeight={800}>{value}</Typography>
                </Box>
            </Paper>
        </motion.div>
    )
}

export default function Dashboard() {
    const [stats, setStats] = useState({ projects: 0, published: 0, drafts: 0, skills: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [projectsData, skillsData] = await Promise.all([
                    getProjectsAdmin(),
                    fetchAdminSkills(),
                ])
                setStats({
                    projects: projectsData.length,
                    published: projectsData.filter(p => p.status === 'published').length,
                    drafts: projectsData.filter(p => p.status === 'draft').length,
                    skills: skillsData.length,
                })
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (loading) {
        return <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 400 }}><CircularProgress /></Box>
    }

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <Stack spacing={4}>
                <motion.div variants={itemVariants}>
                    <Typography variant="h4" fontWeight={800}>Selamat Datang!</Typography>
                    <Typography color="text.secondary">Berikut adalah ringkasan konten portofolio Anda.</Typography>
                </motion.div>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                        <StatCard icon={<ArticleIcon />} title="Total Proyek" value={stats.projects} color="primary" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <StatCard icon={<CodeIcon />} title="Total Skills" value={stats.skills} color="secondary" />
                    </Grid>
                </Grid>

                <motion.div variants={itemVariants}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom>Aksi Cepat</Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <Button
                                component={RouterLink} to="/admin/projects"
                                variant="outlined" endIcon={<ArrowForwardIcon />}
                            >
                                Kelola Proyek
                            </Button>
                            <Button
                                component={RouterLink} to="/admin/skills"
                                variant="outlined" endIcon={<ArrowForwardIcon />}
                            >
                                Kelola Skills
                            </Button>
                            <Button
                                component={RouterLink} to="/admin/profile"
                                variant="outlined" endIcon={<ArrowForwardIcon />}
                            >
                                Edit Profil
                            </Button>
                        </Stack>
                    </Paper>
                </motion.div>
            </Stack>
        </motion.div>
    )
}