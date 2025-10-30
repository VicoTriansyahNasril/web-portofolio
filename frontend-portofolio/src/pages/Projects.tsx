import { useEffect, useState } from 'react'
import { Container, Typography, Box, Chip, Stack, TextField, InputAdornment } from '@mui/material'
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
    const [selectedTag, setSelectedTag] = useState<string | null>(null)

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
            filtered = filtered.filter(
                (p) =>
                    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (p.summary && p.summary.toLowerCase().includes(searchQuery.toLowerCase()))
            )
        }

        if (selectedTag) {
            filtered = filtered.filter((p) => p.tech_stack?.includes(selectedTag))
        }

        setFilteredProjects(filtered)
    }, [searchQuery, selectedTag, projects])

    const allTags = Array.from(
        new Set(projects.flatMap((p) => p.tech_stack?.split(',').map(t => t.trim()) || []))
    ).sort()

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
                        placeholder="Search projects..."
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

                {allTags.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Filter by Technology:
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            <Chip
                                label="All"
                                onClick={() => setSelectedTag(null)}
                                color={selectedTag === null ? 'primary' : 'default'}
                                sx={{ mb: 1 }}
                            />
                            {allTags.map((tag) => (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                                    color={selectedTag === tag ? 'primary' : 'default'}
                                    sx={{ mb: 1 }}
                                />
                            ))}
                        </Stack>
                    </Box>
                )}

                {filteredProjects.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h5" color="text.secondary">
                            No projects found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Try adjusting your search or filters
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