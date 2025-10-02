// src/pages/Projects.jsx
import { Box, Typography, Grid, CircularProgress, Container } from '@mui/material'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getProjectsPublic } from '../api/projects'
import ProjectCard from '../components/public/ProjectCard'

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
}

export default function Projects() {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getProjectsPublic()
                setProjects(data || [])
            } finally {
                setLoading(false)
            }
        }
        fetchProjects()
    }, [])

    return (
        <Container sx={{ py: 4 }}>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Typography variant="h2" fontWeight={800} sx={{ mb: 1 }}>
                    All Projects
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 4 }}>
                    Kumpulan hasil karya dan eksplorasi teknologi saya.
                </Typography>
            </motion.div>

            {loading ? (
                <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 400 }}><CircularProgress /></Box>
            ) : (
                <Box
                    component={motion.div}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Grid container spacing={3}>
                        {projects.map((p) => (
                            <Grid item xs={12} sm={6} md={4} key={p.id}>
                                <ProjectCard project={p} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
        </Container>
    )
}