import { Box, Typography, Paper, Stack, CircularProgress, Button } from '@mui/material';
import { motion, Variants } from 'framer-motion';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ProfileHeader from '@/components/public/ProfileHeader';
import ExperienceTimeline from '@/components/public/ExperienceTimeline';
import SkillChips from '@/components/public/SkillChips';
import { usePublicData } from '@/hooks/usePublicData';
import type { Profile, Skill, Experience, Achievement } from '@/types';

const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: 'easeOut' as const
        }
    }
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

export default function About() {
    const { data: profile, isLoading: profileLoading } = usePublicData<Profile>('/api/profile');
    const { data: skills, isLoading: skillsLoading } = usePublicData<Skill[]>('/api/skills');
    const { data: experiences, isLoading: expLoading } = usePublicData<Experience[]>('/api/experiences');
    const { data: achievements, isLoading: achLoading } = usePublicData<Achievement[]>('/api/achievements');

    const loading = profileLoading || skillsLoading || expLoading || achLoading;

    if (loading) {
        return (
            <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
                <CircularProgress size={50} />
            </Box>
        );
    }

    return (
        <Box>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={sectionVariants}
            >
                <ProfileHeader profile={profile || null} />
            </motion.div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={sectionVariants}
                transition={{ delay: 0.2 }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, md: 4 },
                        mt: 4,
                        borderRadius: 4,
                        background: 'linear-gradient(135deg, rgba(124,58,237,0.03) 0%, rgba(6,182,212,0.03) 100%)',
                        border: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Typography
                        variant="h5"
                        fontWeight={800}
                        mb={3}
                        sx={{
                            position: 'relative',
                            display: 'inline-block',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: -8,
                                left: 0,
                                width: '60%',
                                height: 3,
                                background: 'linear-gradient(90deg, #7C3AED, #06B6D4)',
                                borderRadius: 2
                            }
                        }}
                    >
                        Tentang Saya
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}
                    >
                        {profile?.bio}
                    </Typography>
                </Paper>
            </motion.div>

            {(experiences || []).length > 0 && (
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <Box sx={{ mt: 5 }}>
                        <motion.div variants={sectionVariants}>
                            <Typography
                                variant="h5"
                                fontWeight={800}
                                mb={4}
                                sx={{
                                    position: 'relative',
                                    display: 'inline-block',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: -8,
                                        left: 0,
                                        width: '60%',
                                        height: 3,
                                        background: 'linear-gradient(90deg, #7C3AED, #06B6D4)',
                                        borderRadius: 2
                                    }
                                }}
                            >
                                Pengalaman
                            </Typography>
                        </motion.div>
                        <ExperienceTimeline experiences={experiences || []} />
                    </Box>
                </motion.div>
            )}

            {(skills || []).length > 0 && (
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <Box sx={{ mt: 5 }}>
                        <motion.div variants={sectionVariants}>
                            <Typography
                                variant="h5"
                                fontWeight={800}
                                mb={3}
                                sx={{
                                    position: 'relative',
                                    display: 'inline-block',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: -8,
                                        left: 0,
                                        width: '60%',
                                        height: 3,
                                        background: 'linear-gradient(90deg, #7C3AED, #06B6D4)',
                                        borderRadius: 2
                                    }
                                }}
                            >
                                Keahlian
                            </Typography>
                        </motion.div>
                        <SkillChips skills={skills || []} />
                    </Box>
                </motion.div>
            )}

            {(achievements || []).length > 0 && (
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <Box sx={{ mt: 5 }}>
                        <motion.div variants={sectionVariants}>
                            <Typography
                                variant="h5"
                                fontWeight={800}
                                mb={3}
                                sx={{
                                    position: 'relative',
                                    display: 'inline-block',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: -8,
                                        left: 0,
                                        width: '60%',
                                        height: 3,
                                        background: 'linear-gradient(90deg, #7C3AED, #06B6D4)',
                                        borderRadius: 2
                                    }
                                }}
                            >
                                Pencapaian
                            </Typography>
                        </motion.div>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: 'repeat(2, 1fr)',
                                    md: 'repeat(3, 1fr)'
                                },
                                gap: 3,
                                mt: 2
                            }}
                        >
                            {(achievements || []).map((ach, index) => (
                                <motion.div
                                    key={ach.id}
                                    variants={sectionVariants}
                                    custom={index}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                >
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            height: '100%',
                                            borderRadius: 3,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            transition: 'all 0.3s',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            '&:hover': {
                                                boxShadow: '0 8px 24px rgba(124, 58, 237, 0.15)',
                                                borderColor: 'primary.main'
                                            }
                                        }}
                                    >
                                        <Stack spacing={1.5} sx={{ flex: 1 }}>
                                            <Box
                                                sx={{
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: 2,
                                                    background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '1.5rem'
                                                }}
                                            >
                                                🏆
                                            </Box>
                                            <Typography variant="h6" fontWeight={700}>
                                                {ach.title}
                                            </Typography>
                                            <Typography variant="body2" color="primary.main" fontWeight={600}>
                                                {ach.issuer}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                                                {ach.description}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(ach.date).toLocaleDateString('id-ID', {
                                                    year: 'numeric',
                                                    month: 'long'
                                                })}
                                            </Typography>

                                            {ach.credential_url && (
                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        endIcon={<OpenInNewIcon />}
                                                        href={ach.credential_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        fullWidth
                                                        sx={{
                                                            mt: 1,
                                                            textTransform: 'none',
                                                            fontWeight: 600,
                                                            borderWidth: 2,
                                                            '&:hover': {
                                                                borderWidth: 2
                                                            }
                                                        }}
                                                    >
                                                        {ach.link_text || 'Lihat Kredensial'}
                                                    </Button>
                                                </motion.div>
                                            )}
                                        </Stack>
                                    </Paper>
                                </motion.div>
                            ))}
                        </Box>
                    </Box>
                </motion.div>
            )}
        </Box>
    )
}