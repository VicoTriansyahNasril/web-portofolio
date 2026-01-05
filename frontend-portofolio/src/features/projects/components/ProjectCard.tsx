import { memo } from 'react';
import { Card, CardContent, CardMedia, Typography, Chip, Stack, Box, CardActions, Button, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { transformedFileUrl } from '@/utils/url';
import GitHubIcon from '@mui/icons-material/GitHub';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Project } from '../types';

interface ProjectCardProps {
    project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
    const cover = project?.cover_url || '';
    const techStack = project?.tech_stack ? project.tech_stack.split(',').map((s: string) => s.trim()).filter(Boolean) : [];

    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: 'spring' as const, stiffness: 100 }}
        >
            <Card sx={{ borderRadius: 4, overflow: 'hidden', textDecoration: 'none', display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', height: '100%', border: '1px solid', borderColor: 'divider', transition: 'all 0.3s', '&:hover': { boxShadow: '0px 12px 40px rgba(124, 58, 237, 0.15)', borderColor: 'primary.main' } }} >
                <Box component={RouterLink} to={`/projects/${project.slug}`} state={{ project }} sx={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flexGrow: 1 }} >
                    {cover && (
                        <Box sx={{ position: 'relative', overflow: 'hidden', bgcolor: 'action.hover' }}>
                            <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} >
                                <CardMedia component="img" image={transformedFileUrl(cover, { width: 400 })} alt={project.title} loading="lazy" sx={{ height: 180, objectFit: 'cover' }} />
                            </motion.div>
                            {project.is_featured && (
                                <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring' as const, stiffness: 500, damping: 15 }} >
                                    <Chip label="Featured" size="small" sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 700, boxShadow: 3 }} />
                                </motion.div>
                            )}
                            <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', opacity: 0, transition: 'opacity 0.3s', '&:hover': { opacity: 1 } }} />
                        </Box>
                    )}
                    <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                        <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
                            <Typography variant="h6" fontWeight={700} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', flex: 1, transition: 'color 0.3s', '&:hover': { color: 'primary.main' } }} >
                                {project.title}
                            </Typography>
                        </Stack>
                        {project.role && (
                            <Chip label={project.role} size="small" sx={{ mb: 1.5, bgcolor: 'secondary.main', color: 'secondary.contrastText', fontWeight: 600, fontSize: '0.7rem' }} />
                        )}
                        <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', mb: 2, }} >
                            {project.summary}
                        </Typography>
                        <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                            {techStack.slice(0, 3).map((tech: string, i: number) => ( // FIX: Added types
                                <motion.div key={i} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.1, type: 'spring' as const, stiffness: 300 }} >
                                    <Chip label={tech} size="small" sx={{ fontSize: '0.7rem', height: 24, bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 600 }} />
                                </motion.div>
                            ))}
                            {techStack.length > 3 && (
                                <Chip label={`+${techStack.length - 3}`} size="small" sx={{ fontSize: '0.7rem', height: 24, bgcolor: 'action.hover', fontWeight: 600 }} />
                            )}
                        </Stack>
                    </CardContent>
                </Box>
                {(project.repo_url || project.demo_url) && (
                    <CardActions sx={{ px: 2.5, pb: 2.5, pt: 0 }}>
                        <Stack direction="row" spacing={1}>
                            {project.repo_url && (
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <Button component={MuiLink} href={project.repo_url} target="_blank" size="small" startIcon={<GitHubIcon />} sx={{ textTransform: 'none' }} >
                                        Code
                                    </Button>
                                </motion.div>
                            )}
                            {project.demo_url && (
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <Button component={MuiLink} href={project.demo_url} target="_blank" size="small" startIcon={<OpenInNewIcon />} variant="contained" sx={{ textTransform: 'none' }} >
                                        Demo
                                    </Button>
                                </motion.div>
                            )}
                        </Stack>
                    </CardActions>
                )}
            </Card>
        </motion.div>
    )
}

export default memo(ProjectCard);