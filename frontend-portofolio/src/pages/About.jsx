// src/pages/About.jsx
import { useEffect, useState, useMemo } from 'react';
import { Box, CircularProgress, Typography, Paper, Divider, Container, Link } from '@mui/material';
import { fetchPublicProfile, fetchPublicSkills } from '../api/profile';
import { fetchPublicExperiences } from '../api/experiences';
import { fetchPublicAchievements } from '../api/achievements';
import ProfileHeader from '../components/public/ProfileHeader';
import SkillChips from '../components/public/SkillChips';
import ExperienceTimeline from '../components/public/ExperienceTimeline';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
};

function Section({ title, children }) {
    return (
        <Box
            component={motion.div}
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            sx={{ mt: 6 }}
        >
            <Typography
                variant="h4"
                fontWeight={800}
                sx={{
                    fontSize: { xs: '1.75rem', md: '2.125rem' },
                    mb: 3,
                    position: 'relative',
                    display: 'inline-block',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -4,
                        left: 0,
                        width: '50%',
                        height: '3px',
                        bgcolor: 'primary.main',
                    },
                }}
            >
                {title}
            </Typography>
            {children}
        </Box>
    );
}

export default function About() {
    const [profile, setProfile] = useState(null);
    const [skills, setSkills] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [p, s, e, a] = await Promise.all([
                    fetchPublicProfile(),
                    fetchPublicSkills(),
                    fetchPublicExperiences(),
                    fetchPublicAchievements(),
                ]);
                setProfile(p);
                setSkills(s);
                setExperiences(e);
                setAchievements(a);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const { workExperiences, orgExperiences, educationExperiences } = useMemo(() => {
        const work = experiences.filter(e => e.type === 'Pekerjaan Penuh Waktu' || e.type === 'Magang');
        const org = experiences.filter(e => e.type === 'Organisasi');
        const edu = experiences.filter(e => e.type === 'Pendidikan');
        return { workExperiences: work, orgExperiences: org, educationExperiences: edu };
    }, [experiences]);

    const skillGroupOrder = useMemo(() => {
        try { return JSON.parse(profile?.skill_group_order) } catch { return [] }
    }, [profile]);

    if (loading) {
        return <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '80vh' }}><CircularProgress /></Box>;
    }

    return (
        <Container>
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <motion.div variants={itemVariants}><ProfileHeader profile={profile} /></motion.div>

                {profile?.bio && (<Section title="Tentang Saya"><Paper sx={{ p: { xs: 2, md: 4 } }}><Typography color="text.secondary" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, fontSize: '1.1rem' }}>{profile.bio}</Typography></Paper></Section>)}

                {workExperiences.length > 0 && (<Section title="Pengalaman Kerja"><ExperienceTimeline experiences={workExperiences} /></Section>)}
                {orgExperiences.length > 0 && (<Section title="Organisasi & Kepemimpinan"><ExperienceTimeline experiences={orgExperiences} /></Section>)}
                {educationExperiences.length > 0 && (<Section title="Pendidikan"><ExperienceTimeline experiences={educationExperiences} /></Section>)}

                {skills.length > 0 && (<Section title="Keahlian & Teknologi"><Paper sx={{ p: { xs: 2, md: 4 } }}><SkillChips skills={skills} groupOrder={skillGroupOrder} /></Paper></Section>)}

                {achievements.length > 0 && (
                    <Section title="Pencapaian & Sertifikasi">
                        <Paper sx={{ p: { xs: 2, md: 4 } }}>
                            {achievements.map((item, index) => (
                                <Box key={item.id} sx={{ mb: index === achievements.length - 1 ? 0 : 2 }}>
                                    <Typography fontWeight={700}>{item.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">{item.issuer} - {new Date(item.date).getFullYear()}</Typography>
                                    {item.credential_url && (
                                        <Link href={item.credential_url} target="_blank" variant="caption">
                                            {item.link_text || 'Lihat Kredensial'}
                                        </Link>
                                    )}
                                    {index !== achievements.length - 1 && <Divider sx={{ my: 2 }} />}
                                </Box>
                            ))}
                        </Paper>
                    </Section>
                )}
            </motion.div>
        </Container>
    );
}