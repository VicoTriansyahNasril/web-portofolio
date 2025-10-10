/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState } from 'react'
import { useParams, useLocation, Link as RouterLink } from 'react-router-dom'
import { Box, Button, Chip, Container, Divider, Grid, Paper, Stack, Typography, CircularProgress, Link } from '@mui/material'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import GitHubIcon from '@mui/icons-material/GitHub'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { motion } from 'framer-motion'
import { getProjectBySlug } from '../api/projects'
import Lightbox from '../components/public/Lightbox'
import { fileUrl } from '../utils/url'
import ProjectBody from '../components/public/ProjectBody'

export default function ProjectDetail() {
    const { slug } = useParams()
    const location = useLocation()

    const [data, setData] = useState(location.state?.project || null)
    const [loading, setLoading] = useState(!location.state?.project)

    const [open, setOpen] = useState(false)
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fullData = await getProjectBySlug(slug)
                setData(fullData)
            } catch (err) {
                console.error("Failed to fetch project", err)
            } finally {
                setLoading(false)
            }
        }

        if (!data || !data.body) {
            fetchData()
        }
        window.scrollTo(0, 0)
    }, [slug, data])

    const gallery = useMemo(() => (Array.isArray(data?.gallery) ? data.gallery : []), [data])
    const techStack = useMemo(() => {
        return data?.tech_stack ? data.tech_stack.split(',').map(s => s.trim()).filter(Boolean) : []
    }, [data])

    if (loading || !data) {
        return <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '80vh' }}><CircularProgress /></Box>
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
                                    objectFit: 'contain',
                                }}
                            />
                        </Box>
                    </motion.div>
                )}

                <Grid container spacing={4}>
                    <Grid item xs={12} md={8} sx={{ order: { xs: 2, md: 1 } }}>
                        <ProjectBody body={data.body} />

                        {gallery.length > 0 && (
                            <>
                                <Divider sx={{ my: 3 }} />
                                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Galeri</Typography>
                                <Grid container spacing={2}>
                                    {gallery.map((src, i) => (
                                        <Grid item xs={12} sm={6} md={4} key={i}>
                                            <Box
                                                onClick={() => { setIndex(i); setOpen(true) }}
                                                sx={{
                                                    cursor: 'zoom-in',
                                                    borderRadius: 2,
                                                    overflow: 'hidden',
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    height: { xs: '250px', md: '300px' },
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
                                                        objectFit: 'contain',
                                                        maxWidth: '100%',
                                                        maxHeight: '100%',
                                                        width: 'auto',
                                                        height: 'auto',
                                                        display: 'block'
                                                    }}
                                                />
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </>
                        )}
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ order: { xs: 1, md: 2 } }}>
                        <Box sx={{ position: 'sticky', top: '100px' }}>
                            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                                <Stack spacing={2}>
                                    <Typography fontWeight={600}>Ringkasan</Typography>
                                    <Typography variant="body2" color="text.secondary">{data.summary}</Typography>
                                    <Divider />
                                    <Typography fontWeight={600}>Teknologi</Typography>
                                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                                        {techStack.map((tech) => <Chip key={tech} label={tech} size="small" />)}
                                    </Stack>
                                    <Divider />
                                    <Stack spacing={1}>
                                        {data.demo_url && (
                                            <Button component={Link} href={data.demo_url} target="_blank" rel="noreferrer" endIcon={<OpenInNewIcon />} variant="contained">Lihat Demo</Button>
                                        )}
                                        {data.repo_url && (
                                            <Button component={Link} href={data.repo_url} target="_blank" rel="noreferrer" startIcon={<GitHubIcon />} variant="outlined">Lihat Kode</Button>
                                        )}
                                    </Stack>
                                </Stack>
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            <Lightbox open={open} images={gallery.map(fileUrl)} index={index} onClose={() => setOpen(false)} />
        </Container>
    )
}