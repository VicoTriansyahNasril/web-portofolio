import { Typography, Box, CircularProgress } from '@mui/material'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import ProjectCard from '@/features/projects/components/ProjectCard'
import { Project } from '@/features/projects/types'
import { usePublicData } from '@/hooks/usePublicData'

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

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
}

export default function Projects() {
    const { data: projects, isLoading } = usePublicData<Project[]>('/api/projects')

    if (isLoading) {
        return (
            <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
                <CircularProgress size={50} />
            </Box>
        )
    }

    const safeProjects = Array.isArray(projects) ? projects : []

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
                    sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
                >
                    Berikut adalah koleksi proyek yang telah saya kerjakan
                </Typography>
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
                        {safeProjects.map((project, index) => (
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

            {safeProjects.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h6" color="text.secondary">
                            Belum ada proyek yang ditambahkan.
                        </Typography>
                    </Box>
                </motion.div>
            )}
        </Box>
    )
}