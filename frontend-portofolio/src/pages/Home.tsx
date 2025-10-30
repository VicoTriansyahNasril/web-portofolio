import { useEffect, useState, useMemo } from 'react';
import { Box, Stack, Typography, Paper, Chip, IconButton, Button, CircularProgress, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { fetchPublicProfile } from '../api/profile';
import { fetchPublicSkills } from '../api/skills';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import type { Profile, Skill } from '../types';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

export default function Home() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileData, skillsData] = await Promise.all([
                    fetchPublicProfile(),
                    fetchPublicSkills(),
                ]);
                setProfile(profileData);
                setSkills(skillsData);
            } catch (error) {
                console.error("Error loading home data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const socialLinks = useMemo(() => {
        const github = profile?.socials?.find(s => s.name.toLowerCase() === 'github' && s.active);
        const linkedin = profile?.socials?.find(s => s.name.toLowerCase() === 'linkedin' && s.active);
        return { github, linkedin };
    }, [profile]);

    if (loading) {
        return <Box sx={{ display: 'grid', placeItems: 'center', flex: 1 }}><CircularProgress /></Box>;
    }

    return (
        <Container
            component={motion.div}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                py: 4,
                pointerEvents: 'none',
            }}
        >
            <motion.div variants={itemVariants} style={{ pointerEvents: 'auto' }}>
                <Box sx={{ maxWidth: 500 }}>
                    <Typography variant="h5" color="primary.main" fontWeight={600}>Hi, my name is</Typography>
                    <Typography variant="h2" fontWeight={800} sx={{ my: 1 }}>{profile?.full_name}.</Typography>
                    <Typography variant="h4" fontWeight={700} color="text.secondary">{profile?.headline}</Typography>
                    <Typography color="text.secondary" sx={{ mt: 2, mb: 1 }}>Tentang saya:</Typography>
                    <Stack direction="row" spacing={1}>
                        {socialLinks.github && <IconButton component="a" href={socialLinks.github.url} target="_blank"><GitHubIcon /></IconButton>}
                        {socialLinks.linkedin && <IconButton component="a" href={socialLinks.linkedin.url} target="_blank"><LinkedInIcon /></IconButton>}
                    </Stack>
                </Box>
            </motion.div>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pointerEvents: 'auto' }}>
                <Stack spacing={3} sx={{ alignItems: 'flex-end', maxWidth: 450, width: '100%' }}>
                    <motion.div variants={itemVariants} style={{ width: '100%' }}>
                        <Paper sx={{ p: { xs: 2, md: 3 }, backdropFilter: 'blur(10px)', backgroundColor: 'rgba(17, 22, 42, 0.6)' }}>
                            <Typography variant="h5" fontWeight={700} mb={2}>Teknologi & Keahlian</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {skills.slice(0, 8).map(skill => <Chip key={skill.id} label={skill.name} variant="outlined" />)}
                            </Box>
                            <Button component={RouterLink} to="/about" endIcon={<ArrowForwardIcon />} sx={{ mt: 3, color: 'primary.light' }}>
                                Lihat Semua Keahlian
                            </Button>
                        </Paper>
                    </motion.div>
                    <motion.div variants={itemVariants} style={{ width: '100%' }}>
                        <Paper sx={{ p: { xs: 2, md: 3 }, textAlign: 'center', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(17, 22, 42, 0.6)' }}>
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
    );
}