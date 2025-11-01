import { useEffect, useMemo, useState } from 'react'
import { Typography, Box, CircularProgress, Chip, Stack } from '@mui/material'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { fetchPublicProjects } from '../api/projects'
import ProjectCard from '../components/public/ProjectCard'
import { Project } from '../types'

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: 'spring' as const,
            stiffness: 100,
            damping: 12
        }
    }
};

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedFilter, setSelectedFilter] = useState<string>('all')

    useEffect(() => {
        fetchPublicProjects()
            .then(setProjects)
            .finally(() => setLoading(false))
    }, [])

    const allTech = useMemo(() => {
        const techSet = new Set<string>()
        projects.forEach((p) => {
            if (p.tech_stack) {
                p.tech_stack.split(',').forEach((t) => techSet.add(t.trim()))
            }
        })
        return Array.from(techSet).sort()
    }, [projects])

    const filteredProjects = useMemo(() => {
        if (selectedFilter === 'all') return projects
        return projects.filter((p) =>
            p.tech_stack?.split(',').map((t) => t.trim()).includes(selectedFilter)
        )
    }, [projects, selectedFilter])

    if (loading) {
        return (
            <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
                <CircularProgress size={50} />
            </Box>
        )
    }

    return (
        <Box>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Typography
                    variant="h3"
                    fontWeight={800}
                    gutterBottom
                    textAlign="center"
                    sx={{
                        background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        mb: 1
                    }}
                >
                    Projects
                </Typography>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    textAlign="center"
                    sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
                >
                    Berikut adalah koleksi proyek yang telah saya kerjakan
                </Typography>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    justifyContent="center"
                    sx={{ mb: 4, gap: 1 }}
                >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Chip
                            label="All"
                            clickable
                            onClick={() => setSelectedFilter('all')}
                            color={selectedFilter === 'all' ? 'primary' : 'default'}
                            sx={{
                                fontWeight: 600,
                                transition: 'all 0.3s',
                                ...(selectedFilter === 'all' && {
                                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
                                })
                            }}
                        />
                    </motion.div>
                    {allTech.slice(0, 10).map((tech) => (
                        <motion.div
                            key={tech}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Chip
                                label={tech}
                                clickable
                                onClick={() => setSelectedFilter(tech)}
                                color={selectedFilter === tech ? 'primary' : 'default'}
                                sx={{
                                    fontWeight: 600,
                                    transition: 'all 0.3s',
                                    ...(selectedFilter === tech && {
                                        boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
                                    })
                                }}
                            />
                        </motion.div>
                    ))}
                </Stack>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <AnimatePresence mode="wait">
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(2, 1fr)',
                                md: 'repeat(3, 1fr)'
                            },
                            gap: 3
                        }}
                    >
                        {filteredProjects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                variants={itemVariants}
                                custom={index}
                                layout
                            >
                                <ProjectCard project={project} />
                            </motion.div>
                        ))}
                    </Box>
                </AnimatePresence>
            </motion.div>

            {filteredProjects.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h6" color="text.secondary">
                            Tidak ada proyek yang ditemukan dengan filter ini
                        </Typography>
                    </Box>
                </motion.div>
            )}
        </Box>
    )
}