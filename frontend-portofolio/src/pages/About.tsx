import { Box, CircularProgress } from "@mui/material";
import { motion, Variants } from "framer-motion";
import ProfileHeader from "@/features/profile/components/ProfileHeader";
import ExperienceTimeline from "@/features/experiences/components/ExperienceTimeline";
import SkillChips from "@/features/skills/components/SkillChips";
import AchievementList from "@/features/achievements/components/AchievementList";
import { usePublicData } from "@/hooks/usePublicData";
import type { Profile } from "@/features/profile/types";
import type { Skill } from "@/features/skills/types";
import type { Experience } from "@/features/experiences/types";
import type { Achievement } from "@/features/achievements/types";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

export default function About() {
  const { data: profile, isLoading: profileLoading } =
    usePublicData<Profile>("/api/profile");
  const { data: skills, isLoading: skillsLoading } =
    usePublicData<Skill[]>("/api/skills");
  const { data: experiences, isLoading: expLoading } =
    usePublicData<Experience[]>("/api/experiences");
  const { data: achievements, isLoading: achLoading } =
    usePublicData<Achievement[]>("/api/achievements");

  const loading = profileLoading || skillsLoading || expLoading || achLoading;

  const safeExperiences = Array.isArray(experiences) ? experiences : [];
  const safeSkills = Array.isArray(skills) ? skills : [];
  const safeAchievements = Array.isArray(achievements) ? achievements : [];

  if (loading) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
        <CircularProgress size={50} />
      </Box>
    );
  }

  return (
    <Box>
      <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
        <ProfileHeader profile={profile || null} />
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        transition={{ delay: 0.2 }}
      >
        <div className="glass-heavy p-6 md:p-10 mt-8 rounded-3xl border border-gray-200 dark:border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 dark:from-primary-500/10 dark:to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <h2 className="heading-display text-3xl font-bold mb-6 dark:text-white text-gray-900 inline-block border-b-2 border-primary-500 pb-2 relative z-10">
            About Me
          </h2>
          <p className="dark:text-gray-300 text-gray-700 text-lg leading-relaxed whitespace-pre-wrap relative z-10">
            {profile?.bio}
          </p>
        </div>
      </motion.div>

      {safeExperiences.length > 0 && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="mt-16">
            <motion.div variants={sectionVariants}>
              <h2 className="heading-display text-3xl font-bold mb-8 dark:text-white text-gray-900 inline-block border-b-2 border-primary-500 pb-2">
                Experience
              </h2>
            </motion.div>
            <ExperienceTimeline experiences={safeExperiences} />
          </div>
        </motion.div>
      )}

      {safeSkills.length > 0 && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="mt-16">
            <motion.div variants={sectionVariants}>
              <h2 className="heading-display text-3xl font-bold mb-6 dark:text-white text-gray-900 inline-block border-b-2 border-primary-500 pb-2">
                Skills
              </h2>
            </motion.div>
            <SkillChips
              skills={safeSkills}
              groupOrder={profile?.skill_group_order}
            />
          </div>
        </motion.div>
      )}

      {safeAchievements.length > 0 && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="mt-16">
            <motion.div variants={sectionVariants}>
              <h2 className="heading-display text-3xl font-bold mb-6 dark:text-white text-gray-900 inline-block border-b-2 border-primary-500 pb-2">
                Achievements
              </h2>
            </motion.div>
            <AchievementList achievements={safeAchievements} />
          </div>
        </motion.div>
      )}
    </Box>
  );
}
