import { useEffect, useState } from 'react'
import { Stack, Typography, Box, CircularProgress, Button } from '@mui/material'
import { motion } from 'framer-motion'
import { Link as RouterLink } from 'react-router-dom'
import ArticleIcon from '@mui/icons-material/Article'
import CodeIcon from '@mui/icons-material/Code'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import StatCard from '../components/StatCard'
import { projectAPI } from '@/features/projects/api/projectAPI'
import { skillAPI } from '@/features/skills/api/skillAPI'
import { achievementAPI } from '@/features/achievements/api/achievementAPI'

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

export default function DashboardPage() {
    const [stats, setStats] = useState({ projects: 0, skills: 0, achievements: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadStats = async () => {
            try {
                const [p, s, a] = await Promise.all([
                    projectAPI.getAllAdmin(),
                    skillAPI.getAllAdmin(),
                    achievementAPI.getAllAdmin()
                ])
                setStats({ projects: p.length, skills: s.length, achievements: a.length })
            } catch (error) {
                console.error("Failed to load dashboard stats", error)
            } finally {
                setLoading(false)
            }
        }
        loadStats()
    }, [])

    if (loading) return <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 400 }}><CircularProgress /></Box>

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <Stack spacing={4}>
                <Box>
                    <Typography variant="h4" fontWeight={800} gutterBottom>Dashboard</Typography>
                    <Typography color="text.secondary">Welcome back to your admin panel.</Typography>
                </Box>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard icon={<ArticleIcon />} title="Total Projects" value={stats.projects} color="primary" />
                    <StatCard icon={<CodeIcon />} title="Total Skills" value={stats.skills} color="secondary" />
                    <StatCard icon={<EmojiEventsIcon />} title="Achievements" value={stats.achievements} color="warning" />
                </div>

                <Stack direction="row" spacing={2} flexWrap="wrap" gap={2}>
                    <Button component={RouterLink} to="/admin/projects" variant="contained" endIcon={<ArrowForwardIcon />} size="large">
                        Manage Projects
                    </Button>
                    <Button component={RouterLink} to="/admin/analytics" variant="outlined" endIcon={<ArrowForwardIcon />} size="large">
                        View Analytics
                    </Button>
                </Stack>
            </Stack>
        </motion.div>
    )
}