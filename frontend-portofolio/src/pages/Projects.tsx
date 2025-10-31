import { useEffect, useState } from 'react'
import { Container, Typography, Box, TextField, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { motion } from 'framer-motion'
import { fetchPublicProjects } from '../api/projects'
import ProjectCard from '../components/public/ProjectCard'
import type { Project } from '../types'

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([])
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const data = await fetchPublicProjects()
                const published = data.filter((p) => p.status === 'published')
                setProjects(published)
                setFilteredProjects(published)
            } catch (error) {
                console.error('Error loading projects:', error)
            } finally {
                setLoading(false)
            }
        }
        loadProjects()
    }, [])

    useEffect(() => {
        let filtered = projects

        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase()
            filtered = filtered.filter(
                (p) =>
                    p.title.toLowerCase().includes(lowerCaseQuery) ||
                    (p.summary && p.summary.toLowerCase().includes(lowerCaseQuery)) ||
                    (p.tech_stack && p.tech_stack.toLowerCase().includes(lowerCaseQuery))
            )
        }

        setFilteredProjects(filtered)
    }, [searchQuery, projects])

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Typography>Loading...</Typography>
            </Box>
        )
    }

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Box sx={{ mb: 6, textAlign: 'center' }}>
                    <Typography variant="h2" fontWeight={700} gutterBottom>
                        My Projects
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                        Explore my portfolio of work
                    </Typography>

                    <TextField
                        fullWidth
                        placeholder="Search by title, summary, or technology..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ maxWidth: 600, mx: 'auto' }}
                    />
                </Box>

                {filteredProjects.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h5" color="text.secondary">
                            No projects found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Try adjusting your search keywords
                        </Typography>
                    </Box>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {filteredProjects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <ProjectCard project={project} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </Container>
    )
}