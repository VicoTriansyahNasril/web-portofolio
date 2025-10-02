//src/components/public/ProjectCard.jsx
import { Card, CardContent, CardMedia, Typography, Chip, Stack, Box } from '@mui/material'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fileUrl } from '../../utils/url'

const MotionCard = motion(Card)

export default function ProjectCard({ project }) {
    const cover = project?.cover_url || ''
    const techStack = project?.tech_stack
        ? project.tech_stack.split(',').map(s => s.trim()).filter(Boolean)
        : []

    return (
        <MotionCard
            component={Link}
            to={`/projects/${project.slug}`}
            state={{ project }}
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
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {project.summary}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                    {techStack.map((tech, idx) => (
                        <Chip key={idx} label={tech} size="small" variant="outlined" />
                    ))}
                </Stack>
            </CardContent>
        </MotionCard>
    )
}
