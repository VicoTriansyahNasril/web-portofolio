import { useMemo, useState, useEffect } from 'react';
import { useParams, useLocation, Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Paper, Stack, Chip, Button, Link, Divider } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { motion } from 'framer-motion';
import Lightbox from '../components/public/Lightbox';
import { fileUrl } from '../utils/url';
import ProjectBody from '../components/public/ProjectBody';
import { usePublicData } from '@/hooks/usePublicData';
import { Project } from '../types';

export default function ProjectDetail() {
    const { slug } = useParams<{ slug: string }>();
    const location = useLocation();

    const initialData = location.state?.project as Project | undefined;
    const { data: projectData, isLoading } = usePublicData<Project>(slug ? `/api/projects/${slug}` : null);

    const data = projectData || initialData;

    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    const gallery = useMemo(() => (Array.isArray(data?.gallery) ? data.gallery : []), [data]);
    const techStack = useMemo(() => {
        return data?.tech_stack ? data.tech_stack.split(',').map(s => s.trim()).filter(Boolean) : [];
    }, [data]);

    if (isLoading && !initialData) {
        return <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '80vh' }}><CircularProgress /></Box>;
    }

    if (!data) {
        return (
            <Container sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="h5">Proyek tidak ditemukan.</Typography>
                <Button component={RouterLink} to="/projects" sx={{ mt: 2 }}>
                    Kembali ke Semua Proyek
                </Button>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 4 }}>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <Button
                    component={RouterLink}
                    to="/projects"
                    startIcon={<ArrowBackIcon />}
                    sx={{ mb: 2 }}
                >
                    Semua Proyek
                </Button>
            </motion.div>

            <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 4, overflow: 'hidden' }}>
                <motion.div layoutId={`card-${data.slug}`}>
                    <Typography variant="h3" fontWeight={800} gutterBottom>{data.title}</Typography>
                </motion.div>

                {data.cover_url && (
                    <motion.div layoutId={`image-${data.slug}`}>
                        <Box
                            sx={{
                                height: { xs: 250, md: 350 },
                                width: '100%',
                                bgcolor: 'rgba(0,0,0,0.1)',
                                borderRadius: 2,
                                mb: 3,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                            }}
                        >
                            <img
                                src={fileUrl(data.cover_url)}
                                alt={data.title}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        </Box>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3 order-2 lg:order-1">
                        <ProjectBody body={data.body} />

                        {gallery.length > 0 && (
                            <>
                                <Divider sx={{ my: 4 }} />
                                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Galeri</Typography>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {gallery.map((src, i) => (
                                        <div key={i}>
                                            <Box
                                                onClick={() => { setIndex(i); setOpen(true) }}
                                                sx={{
                                                    cursor: 'zoom-in',
                                                    borderRadius: 2,
                                                    overflow: 'hidden',
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    aspectRatio: '1 / 1',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    bgcolor: 'action.hover',
                                                    transition: 'transform 0.2s ease-in-out',
                                                    '&:hover': {
                                                        transform: 'scale(1.03)',
                                                        boxShadow: 3
                                                    }
                                                }}
                                            >
                                                <img
                                                    src={fileUrl(src)}
                                                    alt={`galeri-${i}`}
                                                    loading="lazy"
                                                    style={{
                                                        objectFit: 'cover',
                                                        width: '100%',
                                                        height: '100%',
                                                    }}
                                                />
                                            </Box>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="lg:col-span-1 order-1 lg:order-2">
                        <Box sx={{ position: { lg: 'sticky' }, top: { lg: '100px' } }}>
                            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.paper' }}>
                                <Stack spacing={2.5}>
                                    <Box>
                                        <Typography fontWeight={700} fontSize="1.1rem" gutterBottom>Ringkasan</Typography>
                                        <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                                            {data.summary}
                                        </Typography>
                                    </Box>

                                    <Divider />

                                    <Box>
                                        <Typography fontWeight={700} fontSize="1.1rem" gutterBottom>Teknologi</Typography>
                                        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                                            {techStack.map((tech) => (
                                                <Chip
                                                    key={tech}
                                                    label={tech}
                                                    size="small"
                                                    sx={{
                                                        fontWeight: 600,
                                                        bgcolor: 'primary.50',
                                                        color: 'primary.700',
                                                        '&:hover': {
                                                            bgcolor: 'primary.100'
                                                        }
                                                    }}
                                                />
                                            ))}
                                        </Stack>
                                    </Box>

                                    {(data.demo_url || data.repo_url) && (
                                        <>
                                            <Divider />
                                            <Stack spacing={1.5}>
                                                {data.demo_url && (
                                                    <Button
                                                        component={Link}
                                                        href={data.demo_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        endIcon={<OpenInNewIcon />}
                                                        variant="contained"
                                                        fullWidth
                                                        sx={{ textTransform: 'none', fontWeight: 600 }}
                                                    >
                                                        Lihat Demo
                                                    </Button>
                                                )}
                                                {data.repo_url && (
                                                    <Button
                                                        component={Link}
                                                        href={data.repo_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        startIcon={<GitHubIcon />}
                                                        variant="outlined"
                                                        fullWidth
                                                        sx={{ textTransform: 'none', fontWeight: 600 }}
                                                    >
                                                        Lihat Kode
                                                    </Button>
                                                )}
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
                images={gallery.map(fileUrl)}
                isOpen={open}
                currentIndex={index}
                onClose={() => setOpen(false)}
                onNavigate={setIndex}
            />
        </Container>
    )
}