import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { motion, Variants } from 'framer-motion';
import ProfileHeader from '@/features/profile/components/ProfileHeader';
import ExperienceTimeline from '@/features/experiences/components/ExperienceTimeline';
import SkillChips from '@/features/skills/components/SkillChips';
import AchievementList from '@/features/achievements/components/AchievementList';
import { usePublicData } from '@/hooks/usePublicData';
import type { Profile } from '@/features/profile/types';
import type { Skill } from '@/features/skills/types';
import type { Experience } from '@/features/experiences/types';
import type { Achievement } from '@/features/achievements/types';

const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' }
    }
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

export default function About() {
    const { data: profile, isLoading: profileLoading } = usePublicData<Profile>('/api/profile');
    const { data: skills, isLoading: skillsLoading } = usePublicData<Skill[]>('/api/skills');
    const { data: experiences, isLoading: expLoading } = usePublicData<Experience[]>('/api/experiences');
    const { data: achievements, isLoading: achLoading } = usePublicData<Achievement[]>('/api/achievements');

    const loading = profileLoading || skillsLoading || expLoading || achLoading;

    const safeExperiences = Array.isArray(experiences) ? experiences : [];
    const safeSkills = Array.isArray(skills) ? skills : [];
    const safeAchievements = Array.isArray(achievements) ? achievements : [];

    if (loading) {
        return (
            <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
                <CircularProgress size={50} />
            </Box>
        );
    }

    return (
        <Box>
            <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
                <ProfileHeader profile={profile || null} />
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={sectionVariants} transition={{ delay: 0.2 }}>
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
                    <Typography variant="h5" fontWeight={800} mb={3} sx={{ borderBottom: '3px solid #7C3AED', display: 'inline-block', pb: 1 }}>
                        About Me
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                        {profile?.bio}
                    </Typography>
                </Paper>
            </motion.div>

            {safeExperiences.length > 0 && (
                <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
                    <Box sx={{ mt: 5 }}>
                        <motion.div variants={sectionVariants}>
                            <Typography variant="h5" fontWeight={800} mb={4} sx={{ borderBottom: '3px solid #7C3AED', display: 'inline-block', pb: 1 }}>
                                Experience
                            </Typography>
                        </motion.div>
                        <ExperienceTimeline experiences={safeExperiences} />
                    </Box>
                </motion.div>
            )}

            {safeSkills.length > 0 && (
                <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
                    <Box sx={{ mt: 5 }}>
                        <motion.div variants={sectionVariants}>
                            <Typography variant="h5" fontWeight={800} mb={3} sx={{ borderBottom: '3px solid #7C3AED', display: 'inline-block', pb: 1 }}>
                                Skills
                            </Typography>
                        </motion.div>
                        <SkillChips skills={safeSkills} groupOrder={profile?.skill_group_order} />
                    </Box>
                </motion.div>
            )}

            {safeAchievements.length > 0 && (
                <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
                    <Box sx={{ mt: 5 }}>
                        <motion.div variants={sectionVariants}>
                            <Typography variant="h5" fontWeight={800} mb={3} sx={{ borderBottom: '3px solid #7C3AED', display: 'inline-block', pb: 1 }}>
                                Achievements
                            </Typography>
                        </motion.div>
                        <AchievementList achievements={safeAchievements} />
                    </Box>
                </motion.div>
            )}
        </Box>
    )
}