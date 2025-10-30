import { useEffect, useState, ReactNode } from 'react'
import { Paper, Stack, Typography, Box, CircularProgress, Button } from '@mui/material'
import { motion } from 'framer-motion'
import { Link as RouterLink } from 'react-router-dom'
import ArticleIcon from '@mui/icons-material/Article'
import CodeIcon from '@mui/icons-material/Code'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { fetchAdminProjects } from '../../api/projects'
import { fetchAdminSkills } from '../../api/skills'

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
}

interface StatCardProps {
    icon: ReactNode;
    title: string;
    value: number | string;
    color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
}

function StatCard({ icon, title, value, color }: StatCardProps) {
    return (
        <motion.div variants={itemVariants}>
            <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ width: 56, height: 56, borderRadius: '50%', display: 'grid', placeItems: 'center', bgcolor: `${color}.main`, color: 'white' }}>
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
    const [loading, setLoading] = useState<boolean>(true)
    const [projectCount, setProjectCount] = useState<number>(0)
    const [skillCount, setSkillCount] = useState<number>(0)

    useEffect(() => {
        const load = async () => {
            try {
                const [projects, skills] = await Promise.all([fetchAdminProjects(), fetchAdminSkills()])
                setProjectCount(Array.isArray(projects) ? projects.length : 0)
                setSkillCount(Array.isArray(skills) ? skills.length : 0)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    if (loading) {
        return <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 400 }}><CircularProgress /></Box>
    }

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <Stack spacing={3}>
                <Typography variant="h5" fontWeight={800}>Dashboard</Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <StatCard icon={<ArticleIcon />} title="Total Projects" value={projectCount} color="primary" />
                    </div>
                    <div>
                        <StatCard icon={<CodeIcon />} title="Total Skills" value={skillCount} color="secondary" />
                    </div>
                </div>
                <Stack direction="row" spacing={2}>
                    <Button component={RouterLink} to="/admin/projects" variant="contained" endIcon={<ArrowForwardIcon />}>Kelola Projects</Button>
                    <Button component={RouterLink} to="/admin/skills" variant="outlined" endIcon={<ArrowForwardIcon />}>Kelola Skills</Button>
                </Stack>
            </Stack>
        </motion.div>
    )
}