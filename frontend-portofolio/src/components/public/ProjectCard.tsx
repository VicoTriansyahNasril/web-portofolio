import { Card, CardContent, CardMedia, Typography, Chip, Stack, Box, CardActions, Button, Link as MuiLink } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fileUrl } from '../../utils/url'
import GitHubIcon from '@mui/icons-material/GitHub'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { Project } from '../../types'

const MotionCard = motion(Card)

interface ProjectCardProps {
    project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
    const cover = project?.cover_url || ''
    const techStack = project?.tech_stack
        ? project.tech_stack.split(',').map((s: string) => s.trim()).filter(Boolean)
        : []

    return (
        <MotionCard
            whileHover={{ scale: 1.05, boxShadow: "0px 10px 25px rgba(0,0,0,0.25)" }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{
                borderRadius: 4,
                overflow: 'hidden',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                height: '100%',
            }}
        >
            <Box
                component={RouterLink}
                to={`/projects/${project.slug}`}
                state={{ project }}
                sx={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flexGrow: 1 }}
            >
                {cover && (
                    <CardMedia
                        component="img"
                        image={fileUrl(cover)}
                        alt={project.title}
                        sx={{ height: 180, objectFit: 'cover' }}
                    />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {project.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3, overflow: 'hidden' }}>
                        {project.summary}
                    </Typography>
                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                        {techStack.map((tech: string, idx: number) => (
                            <Chip key={idx} label={tech} size="small" variant="outlined" />
                        ))}
                    </Stack>
                </CardContent>
            </Box>

            {(project.demo_url || project.repo_url) && (
                <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                    {project.demo_url && (
                        <Button
                            component={MuiLink}
                            href={project.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                            startIcon={<OpenInNewIcon />}
                        >
                            Demo
                        </Button>
                    )}
                    {project.repo_url && (
                        <Button
                            component={MuiLink}
                            href={project.repo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                            startIcon={<GitHubIcon />}
                        >
                            Kode
                        </Button>
                    )}
                </CardActions>
            )}
        </MotionCard>
    )
}