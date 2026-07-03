import { Box, CircularProgress } from '@mui/material'
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
        <div>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
            >
                <h2 className="heading-display text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-secondary-500 bg-clip-text text-transparent">
                    Projects
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Berikut adalah koleksi proyek yang telah saya kerjakan.
                </p>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <AnimatePresence mode="wait">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
                    </div>
                </AnimatePresence>
            </motion.div>

            {safeProjects.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="text-center py-16">
                        <p className="text-gray-500 text-lg">
                            Belum ada proyek yang ditambahkan.
                        </p>
                    </div>
                </motion.div>
            )}
        </div>
    )
}