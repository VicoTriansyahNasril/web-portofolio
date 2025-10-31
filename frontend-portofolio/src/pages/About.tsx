import { useEffect, useState, useMemo, ReactNode } from 'react';
import { Box, CircularProgress, Typography, Paper, Divider, Container, Stack, Link, Button } from '@mui/material';
import { fetchPublicProfile } from '@/api/profile';
import { fetchPublicSkills } from '@/api/skills';
import { fetchPublicExperiences } from '@/api/experiences';
import { fetchPublicAchievements } from '@/api/achievements';
import ProfileHeader from '@/components/public/ProfileHeader';
import SkillChips from '@/components/public/SkillChips';
import ExperienceTimeline from '@/components/public/ExperienceTimeline';
import { motion, Variants } from 'framer-motion';
import type { Profile, Skill, Experience, Achievement } from '@/types';

import CodeIcon from '@mui/icons-material/Code';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LaunchIcon from '@mui/icons-material/Launch';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 100 } },
};

function Section({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
    return (
        <motion.section variants={itemVariants} className="mb-16">
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: (t) => `linear-gradient(135deg, ${t.palette.primary.main} 0%, ${t.palette.secondary.main} 100%)`,
                    color: 'white',
                    boxShadow: (t) => `0 4px 20px ${t.palette.primary.main}40`,
                }}>
                    {icon}
                </Box>
                <Typography variant="h4" fontWeight={800}>
                    {title}
                </Typography>
            </Stack>
            {children}
        </motion.section>
    );
}

function AchievementCard({ item }: { item: Achievement }) {
    return (
        <Paper
            sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                }
            }}
        >
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight={700}>{item.title}</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>{item.issuer}</Typography>
                <Typography variant="caption" color="text.secondary">{new Date(item.date).getFullYear()}</Typography>
                {item.description && (
                    <Typography variant="body2" sx={{ mt: 2, whiteSpace: 'pre-wrap', color: 'text.secondary' }}>
                        {item.description}
                    </Typography>
                )}
            </Box>
            {item.credential_url && (
                <Button
                    component={Link}
                    href={item.credential_url}
                    target="_blank"
                    endIcon={<LaunchIcon />}
                    sx={{ mt: 2, alignSelf: 'flex-start' }}
                >
                    {item.link_text || 'Lihat Kredensial'}
                </Button>
            )}
        </Paper>
    );
}

export default function About() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
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

    const skillGroupOrder = useMemo(() => {
        try {
            return JSON.parse(profile?.skill_group_order || '[]') as string[];
        } catch {
            return [];
        }
    }, [profile]);

    if (loading) {
        return (
            <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '80vh' }}>
                <CircularProgress size={50} />
            </Box>
        );
    }

    return (
        <Container sx={{ py: 4 }}>
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <motion.div variants={itemVariants}>
                    <ProfileHeader profile={profile} />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 mt-8 md:mt-12">
                    <motion.div variants={itemVariants} className="md:col-span-7">
                        <Typography variant="h4" fontWeight={800} sx={{ mb: 2 }}>
                            Tentang Saya
                        </Typography>
                        <Typography
                            color="text.secondary"
                            sx={{
                                whiteSpace: 'pre-wrap',
                                lineHeight: 1.8,
                                fontSize: '1.1rem',
                            }}
                        >
                            {profile?.bio}
                        </Typography>
                    </motion.div>
                    <motion.div variants={itemVariants} className="md:col-span-5">
                        <Typography variant="h4" fontWeight={800} sx={{ mb: 2 }}>
                            Perjalanan Karir
                        </Typography>
                        <ExperienceTimeline experiences={experiences} />
                    </motion.div>
                </div>

                <Divider sx={{ my: 8, opacity: 0.5 }} />

                {skills.length > 0 && (
                    <Section title="Keahlian & Teknologi" icon={<CodeIcon />}>
                        <Paper sx={{ p: { xs: 3, md: 4 } }}>
                            <SkillChips skills={skills} groupOrder={skillGroupOrder} />
                        </Paper>
                    </Section>
                )}

                {achievements.length > 0 && (
                    <Section title="Pencapaian & Sertifikasi" icon={<EmojiEventsIcon />}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {achievements.map((item) => (
                                <motion.div key={item.id} variants={itemVariants}>
                                    <AchievementCard item={item} />
                                </motion.div>
                            ))}
                        </div>
                    </Section>
                )}
            </motion.div>
        </Container>
    );
}