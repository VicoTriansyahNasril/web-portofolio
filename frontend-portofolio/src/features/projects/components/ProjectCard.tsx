import { useState } from 'react'
import { Typography, Chip, Stack, Box, Button } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import GitHubIcon from '@mui/icons-material/GitHub'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import InfoIcon from '@mui/icons-material/Info'
import { Project } from '../types'
import { transformedFileUrl } from '@/utils/url'

interface ProjectCardProps {
    project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
    const [isFlipped, setIsFlipped] = useState(false)
    const cover = project?.cover_url || ''
    const techStack = project?.tech_stack ? project.tech_stack.split(',').map(s => s.trim()).filter(Boolean) : []

    const handleFlip = () => setIsFlipped(!isFlipped)

    return (
        <Box
            sx={{
                perspective: 1000,
                height: 380,
                cursor: 'pointer'
            }}
            onClick={handleFlip}
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
        >
            <motion.div
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    transformStyle: 'preserve-3d',
                }}
            >
                {/* FRONT FACE */}
                <Box
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        borderRadius: 4,
                        overflow: 'hidden',
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: 3,
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <Box sx={{ height: '65%', position: 'relative', overflow: 'hidden' }}>
                        <Box
                            component="img"
                            src={transformedFileUrl(cover, { width: 500, height: 400 })}
                            alt={project.title}
                            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)',
                            }}
                        />
                        <Box sx={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
                            <Typography variant="h5" fontWeight={800} color="white" sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                {project.title}
                            </Typography>
                            {project.role && (
                                <Typography variant="subtitle2" color="rgba(255,255,255,0.9)">
                                    {project.role}
                                </Typography>
                            )}
                        </Box>
                        {project.is_featured && (
                            <Chip
                                label="Featured"
                                size="small"
                                sx={{
                                    position: 'absolute',
                                    top: 12,
                                    right: 12,
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    fontWeight: 700
                                }}
                            />
                        )}
                    </Box>
                    <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {project.summary}
                        </Typography>
                        <Typography variant="caption" color="primary.main" fontWeight={600} textAlign="center" sx={{ mt: 1 }}>
                            Hover / Tap for Details
                        </Typography>
                    </Box>
                </Box>

                {/* BACK FACE */}
                <Box
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        borderRadius: 4,
                        overflow: 'hidden',
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'primary.main',
                        boxShadow: 6,
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        background: (t) => t.palette.mode === 'dark'
                            ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
                            : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
                    }}
                >
                    <Typography variant="h6" fontWeight={700} gutterBottom color="primary">
                        Tech Stack
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mb: 4 }}>
                        {techStack.slice(0, 6).map((tech, i) => (
                            <Chip key={i} label={tech} size="small" variant="outlined" sx={{ borderColor: 'primary.main', color: 'text.primary' }} />
                        ))}
                        {techStack.length > 6 && <Chip label={`+${techStack.length - 6}`} size="small" />}
                    </Box>

                    <Stack spacing={2} width="100%">
                        <Button
                            component={RouterLink}
                            to={`/projects/${project.slug}`}
                            state={{ project }}
                            variant="contained"
                            fullWidth
                            startIcon={<InfoIcon />}
                        >
                            View Details
                        </Button>
                        <Stack direction="row" spacing={2}>
                            {project.repo_url && (
                                <Button
                                    href={project.repo_url}
                                    target="_blank"
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<GitHubIcon />}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    Code
                                </Button>
                            )}
                            {project.demo_url && (
                                <Button
                                    href={project.demo_url}
                                    target="_blank"
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<OpenInNewIcon />}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    Demo
                                </Button>
                            )}
                        </Stack>
                    </Stack>
                </Box>
            </motion.div>
        </Box>
    )
}