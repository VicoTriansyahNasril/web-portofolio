/* eslint-disable no-unused-vars */
// src/pages/Home.jsx
import { useEffect, useState, useMemo } from 'react'
import { Box, Stack, Typography, Paper, Grid, CircularProgress, Chip, IconButton, Button, Container } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchPublicProfile, fetchPublicSkills } from '../api/profile'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import Footer from '../components/layout/Footer'

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function Home() {
    const [profile, setProfile] = useState(null)
    const [skills, setSkills] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileData, skillsData] = await Promise.all([
                    fetchPublicProfile(), fetchPublicSkills(),
                ])
                setProfile(profileData)
                setSkills(skillsData)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const socialLinks = useMemo(() => {
        const github = profile?.socials?.find(s => s.name.toLowerCase() === 'github')
        const linkedin = profile?.socials?.find(s => s.name.toLowerCase() === 'linkedin')
        return { github, linkedin }
    }, [profile])

    if (loading) {
        return <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '80vh' }}><CircularProgress size={50} /></Box>
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Container
                component="main"
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    py: 4
                }}
            >
                <Box>
                    <motion.div variants={itemVariants}>
                        <Box sx={{ maxWidth: 500, textAlign: { xs: 'center', md: 'left' } }}>
                            <Typography variant="h5" color="primary.main" fontWeight={600}>Hi, my name is</Typography>
                            <Typography variant="h2" fontWeight={800} sx={{ my: 1 }}>{profile?.full_name}.</Typography>
                            <Typography variant="h4" fontWeight={700} color="text.secondary">{profile?.headline}</Typography>
                            <Typography color="text.secondary" sx={{ mt: 2, mb: 3 }}>{profile?.bio?.split('\n')[0]}</Typography>
                            <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                                {socialLinks.github && <IconButton component="a" href={socialLinks.github.url} target="_blank"><GitHubIcon /></IconButton>}
                                {socialLinks.linkedin && <IconButton component="a" href={socialLinks.linkedin.url} target="_blank"><LinkedInIcon /></IconButton>}
                            </Stack>
                        </Box>
                    </motion.div>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Stack spacing={3} sx={{ alignItems: 'flex-end', maxWidth: 450, width: '100%' }}>
                        <motion.div variants={itemVariants} style={{ width: '100%' }}>
                            <Paper sx={{ p: { xs: 2, md: 4 } }}>
                                <Typography variant="h5" fontWeight={700} mb={2}>Teknologi & Keahlian</Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {skills.slice(0, 8).map(skill => <Chip key={skill.id} label={skill.name} variant="outlined" />)}
                                </Box>
                                <Button component={RouterLink} to="/about" endIcon={<ArrowForwardIcon />} sx={{ mt: 3 }}>
                                    Lihat Semua Keahlian
                                </Button>
                            </Paper>
                        </motion.div>
                        <motion.div variants={itemVariants} style={{ width: '100%' }}>
                            <Paper sx={{ p: { xs: 2, md: 4 }, textAlign: 'center' }}>
                                <Typography variant="h5" fontWeight={700}>Lihat Semua Karya Saya</Typography>
                                <Typography color="text.secondary" my={1}>Eksplorasi lebih dalam hasil kerja dan proyek pribadi saya.</Typography>
                                <Button component={RouterLink} to="/projects" variant="contained" sx={{ mt: 2 }}>
                                    Semua Proyek
                                </Button>
                            </Paper>
                        </motion.div>
                    </Stack>
                </Box>
            </Container>
            <Footer />
        </Box>
    )
}