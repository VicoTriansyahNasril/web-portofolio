import { useMemo, useState, useEffect } from 'react';
import { useParams, useLocation, Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Paper, Stack, Chip, Button, Divider } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { motion } from 'framer-motion';
import useSWR from 'swr';

import Lightbox from '@/components/ui/Lightbox';
import ProjectBody from '@/features/projects/components/ProjectBody';
import { fileUrl } from '@/utils/url';
import { projectAPI } from '@/features/projects/api/projectAPI';
import { Project } from '@/features/projects/types';

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

export default function ProjectDetail() {
    const { slug } = useParams<{ slug: string }>()
    const location = useLocation()
    const initialData = location.state?.project as Project | undefined

    // Use SWR for caching and revalidation
    const { data: project, isLoading } = useSWR<Project | null>(
        slug ? `/api/projects/${slug}` : null,
        () => projectAPI.getBySlug(slug!)
    )

    const data = project || initialData
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [photoIndex, setPhotoIndex] = useState(0)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [slug])

    const gallery = useMemo(() => data?.gallery || [], [data])
    const techStack = useMemo(() => data?.tech_stack ? data.tech_stack.split(',').map(s => s.trim()) : [], [data])

    if (isLoading && !initialData) {
        return <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '80vh' }}><CircularProgress /></Box>
    }

    if (!data) {
        return (
            <Container sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>Project Not Found</Typography>
                <Button component={RouterLink} to="/projects" variant="outlined">Back to Projects</Button>
            </Container>
        )
    }

    return (
        <Container sx={{ py: 4 }}>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <Button component={RouterLink} to="/projects" startIcon={<ArrowBackIcon />} sx={{ mb: 3 }}>All Projects</Button>
            </motion.div>

            <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, overflow: 'hidden' }}>
                <motion.div layoutId={`card-${data.slug}`}>
                    <Typography variant="h3" fontWeight={800} gutterBottom>{data.title}</Typography>
                </motion.div>

                <Stack direction="row" spacing={2} mb={3} alignItems="center" flexWrap="wrap" gap={1}>
                    {data.role && <Chip label={data.role} color="secondary" variant="outlined" />}
                    {data.start_date && (
                        <Chip icon={<CalendarTodayIcon />} label={`${formatDate(data.start_date)} - ${data.end_date ? formatDate(data.end_date) : 'Present'}`} variant="outlined" />
                    )}
                </Stack>

                {data.cover_url && (
                    <motion.div layoutId={`image-${data.slug}`}>
                        <Box
                            sx={{ height: { xs: 250, md: 450 }, width: '100%', bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 3, mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'zoom-in' }}
                            onClick={() => { setPhotoIndex(0); setLightboxOpen(true) }}
                        >
                            <img src={fileUrl(data.cover_url)} alt={data.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Box>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3 order-2 lg:order-1">
                        <ProjectBody body={data.body} />
                        {gallery.length > 0 && (
                            <>
                                <Divider sx={{ my: 6 }} />
                                <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>Gallery</Typography>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {gallery.map((src, i) => (
                                        <motion.div key={i} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <Box onClick={() => { setPhotoIndex(i); setLightboxOpen(true) }} sx={{ cursor: 'zoom-in', borderRadius: 2, overflow: 'hidden', aspectRatio: '16/9', bgcolor: 'action.hover' }}>
                                                <img src={fileUrl(src)} alt={`Gallery ${i}`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </Box>
                                        </motion.div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="lg:col-span-1 order-1 lg:order-2">
                        <Box sx={{ position: { lg: 'sticky' }, top: { lg: '100px' } }}>
                            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, bgcolor: 'background.paper' }}>
                                <Stack spacing={3}>
                                    <Box>
                                        <Typography fontWeight={700} fontSize="1.1rem" gutterBottom>Overview</Typography>
                                        <Typography variant="body2" color="text.secondary" lineHeight={1.6}>{data.summary}</Typography>
                                    </Box>
                                    <Divider />
                                    <Box>
                                        <Typography fontWeight={700} fontSize="1.1rem" gutterBottom>Technologies</Typography>
                                        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                                            {techStack.map((tech) => <Chip key={tech} label={tech} size="small" sx={{ fontWeight: 600, bgcolor: 'primary.50', color: 'primary.700' }} />)}
                                        </Stack>
                                    </Box>
                                    {(data.demo_url || data.repo_url) && (
                                        <>
                                            <Divider />
                                            <Stack spacing={2}>
                                                {data.demo_url && <Button component="a" href={data.demo_url} target="_blank" rel="noreferrer" endIcon={<OpenInNewIcon />} variant="contained" fullWidth>Live Demo</Button>}
                                                {data.repo_url && <Button component="a" href={data.repo_url} target="_blank" rel="noreferrer" startIcon={<GitHubIcon />} variant="outlined" fullWidth>Source Code</Button>}
                                            </Stack>
                                        </>
                                    )}
                                </Stack>
                            </Paper>
                        </Box>
                    </div>
                </div>
            </Paper>

            <Lightbox
                images={data.cover_url ? [fileUrl(data.cover_url), ...gallery.map(fileUrl)] : gallery.map(fileUrl)}
                isOpen={lightboxOpen}
                currentIndex={photoIndex}
                onClose={() => setLightboxOpen(false)}
                onNavigate={setPhotoIndex}
            />
        </Container>
    )
}