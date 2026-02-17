import { useEffect, useMemo, Suspense, lazy, useRef } from 'react'
import { Box, Stack, Typography, Paper, CircularProgress, Chip, IconButton, Button, Container } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { motion, Variants } from 'framer-motion'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import { usePublicData } from '@/hooks/usePublicData'
import type { Profile } from '@/features/profile/types'
import type { Skill } from '@/features/skills/types'
import LazySection from '@/components/utils/LazySection'
import Interactive3D from '@/components/ui/Interactive3D'
import SectionBackground from '@/components/ui/SectionBackground'
import { useScrollSectionTracker } from '@/hooks/useScrollSectionTracker'

const ProjectsSection = lazy(() => import('./Projects'))
const AboutSection = lazy(() => import('./About'))

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
}

const chipVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: { type: 'spring', stiffness: 300, damping: 20 }
    }
}

export default function Home() {
    const location = useLocation()
    const homeRef = useRef<HTMLDivElement>(null)
    const { data: profile, isLoading: profileLoading } = usePublicData<Profile>('/api/profile')
    const { data: skills, isLoading: skillsLoading } = usePublicData<Skill[]>('/api/skills')

    const loading = profileLoading || skillsLoading
    useScrollSectionTracker()
    useEffect(() => {
        if (location.state?.scrollTo) {
            const sectionId = location.state.scrollTo
            const element = document.getElementById(sectionId)
            if (element) {
                setTimeout(() => {
                    const headerOffset = 80
                    const elementPosition = element.getBoundingClientRect().top
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    })
                }, 300)
            }
            window.history.replaceState({}, document.title)
        }
    }, [location])

    const socialLinks = useMemo(() => {
        const github = profile?.socials?.find((s) => s.name.toLowerCase() === 'github')
        const linkedin = profile?.socials?.find((s) => s.name.toLowerCase() === 'linkedin')
        return { github, linkedin }
    }, [profile])

    const safeSkills = Array.isArray(skills) ? skills : []

    const handleScrollToProjects = () => {
        const element = document.getElementById('projects')
        if (element) {
            const headerOffset = 80
            const elementPosition = element.getBoundingClientRect().top
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            })
        }
    }

    if (loading) {
        return (
            <Box sx={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
                <CircularProgress size={50} />
            </Box>
        )
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box
                component="section"
                id="home"
                ref={homeRef}
                sx={{
                    height: '100vh',
                    width: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: 'transparent',
                    userSelect: 'none',
                    cursor: 'grab',
                    '&:active': {
                        cursor: 'grabbing'
                    }
                }}
            >
                <Suspense fallback={null}>
                    <Interactive3D rootRef={homeRef} />
                </Suspense>

                <Container
                    component="main"
                    sx={{
                        position: 'relative',
                        zIndex: 10,
                        height: '100%',
                        pointerEvents: 'none'
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', py: 4 }}>
                        <Box sx={{ pointerEvents: 'auto', mt: 8 }}>
                            <motion.div variants={itemVariants} initial="hidden" animate="visible">
                                <Box sx={{ maxWidth: 600, textAlign: { xs: 'center', md: 'left' } }}>
                                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                                        <Typography variant="h5" color="primary.main" fontWeight={600}>Hi, my name is</Typography>
                                    </motion.div>

                                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.4, type: 'spring', stiffness: 100 }}>
                                        <Typography variant="h2" fontWeight={800} sx={{ my: 1, background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                            {profile?.full_name}.
                                        </Typography>
                                    </motion.div>

                                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.6 }}>
                                        <Typography variant="h4" fontWeight={700} color="text.secondary">{profile?.headline}</Typography>
                                    </motion.div>

                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }}>
                                        <Typography color="text.secondary" sx={{ mt: 2, mb: 3, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                                            {profile?.bio?.split('\n')[0]}
                                        </Typography>
                                    </motion.div>

                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1 }}>
                                        <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                                            {socialLinks.github && (
                                                <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.95 }}>
                                                    <IconButton component="a" href={socialLinks.github.url} target="_blank" color="primary"><GitHubIcon /></IconButton>
                                                </motion.div>
                                            )}
                                            {socialLinks.linkedin && (
                                                <motion.div whileHover={{ scale: 1.1, rotate: -5 }} whileTap={{ scale: 0.95 }}>
                                                    <IconButton component="a" href={socialLinks.linkedin.url} target="_blank" color="primary"><LinkedInIcon /></IconButton>
                                                </motion.div>
                                            )}
                                        </Stack>
                                    </motion.div>
                                </Box>
                            </motion.div>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: { xs: 4, md: 0 }, pointerEvents: 'auto', mb: 4 }}>
                            <Stack spacing={3} sx={{ alignItems: 'flex-end', maxWidth: 500, width: '100%' }}>
                                <motion.div variants={itemVariants} initial="hidden" animate="visible" style={{ width: '100%' }} whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
                                    <Paper sx={{ p: { xs: 2, md: 4 }, background: 'linear-gradient(135deg, rgba(124,58,237,0.05) 0%, rgba(6,182,212,0.05) 100%)', backdropFilter: 'blur(10px)', border: '1px solid', borderColor: 'divider' }}>
                                        <Typography variant="h5" fontWeight={700} mb={2}>Tech Stack</Typography>
                                        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {safeSkills.slice(0, 8).map((skill, index) => (
                                                    <motion.div key={skill.id} variants={chipVariants} custom={index} whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}>
                                                        <Chip label={skill.name} variant="outlined" sx={{ transition: 'all 0.3s', '&:hover': { bgcolor: 'primary.main', color: 'primary.contrastText', borderColor: 'primary.main' } }} />
                                                    </motion.div>
                                                ))}
                                            </Box>
                                        </motion.div>
                                    </Paper>
                                </motion.div>

                                <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }} style={{ width: '100%' }} whileHover={{ scale: 1.02, y: -5 }}>
                                    <Paper sx={{ p: { xs: 2, md: 4 }, textAlign: 'center', background: 'linear-gradient(135deg, rgba(6,182,212,0.05) 0%, rgba(124,58,237,0.05) 100%)', border: '1px solid', borderColor: 'divider', position: 'relative', overflow: 'hidden' }}>
                                        <Typography variant="h5" fontWeight={700}>Explore My Work</Typography>
                                        <Typography color="text.secondary" my={1}>Check out my latest projects and experiments.</Typography>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button onClick={handleScrollToProjects} variant="contained" sx={{ mt: 2, boxShadow: 3 }} endIcon={<ArrowForwardIcon />}>View Projects</Button>
                                        </motion.div>
                                    </Paper>
                                </motion.div>
                            </Stack>
                        </Box>
                    </Box>
                </Container>
            </Box>

            <Box component="section" id="projects" sx={{ py: 10, minHeight: '100vh', bgcolor: 'background.default', position: 'relative' }}>
                <SectionBackground />
                <Container sx={{ position: 'relative', zIndex: 1 }}>
                    <LazySection>
                        <Suspense fallback={null}>
                            <ProjectsSection />
                        </Suspense>
                    </LazySection>
                </Container>
            </Box>

            <Box component="section" id="about" sx={{ py: 10, minHeight: '100vh', bgcolor: 'background.default', position: 'relative' }}>
                <SectionBackground />
                <Container sx={{ position: 'relative', zIndex: 1 }}>
                    <LazySection>
                        <Suspense fallback={null}>
                            <AboutSection />
                        </Suspense>
                    </LazySection>
                </Container>
            </Box>
        </Box>
    )
}