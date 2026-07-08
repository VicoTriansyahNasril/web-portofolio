import { useEffect, useMemo, Suspense, lazy, useRef } from "react";
import { Box, CircularProgress, Container } from "@mui/material";
import { useLocation } from "react-router-dom";
import { motion, Variants } from "framer-motion";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { usePublicData } from "@/hooks/usePublicData";
import type { Profile } from "@/features/profile/types";
import type { Skill } from "@/features/skills/types";
import type { Testimonial } from "@/features/testimonials/types";
import LazySection from "@/components/utils/LazySection";
import Interactive3D from "@/components/ui/Interactive3D";
import SectionBackground from "@/components/ui/SectionBackground";
import SEO from "@/components/ui/SEO";
import { useScrollSectionTracker } from "@/hooks/useScrollSectionTracker";

const ProjectsSection = lazy(() => import("./Projects"));
const AboutSection = lazy(() => import("./About"));
const TestimonialSection = lazy(
  () => import("@/features/testimonials/components/TestimonialSection"),
);
const ContactSection = lazy(() => import("./Contact"));

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const chipVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

export default function Home() {
  const location = useLocation();
  const homeRef = useRef<HTMLDivElement>(null);
  const { data: profile, isLoading: profileLoading } =
    usePublicData<Profile>("/api/profile");
  const { data: skills, isLoading: skillsLoading } =
    usePublicData<Skill[]>("/api/skills");
  const { data: testimonialsRes, isLoading: testimonialsLoading } =
    usePublicData<{ data: Testimonial[] }>("/api/testimonials");

  const loading = profileLoading || skillsLoading || testimonialsLoading;
  useScrollSectionTracker();
  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      const sectionId = state.scrollTo;
      const element = document.getElementById(sectionId);
      if (element) {
        setTimeout(() => {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }, 300);
      }
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const socialLinks = useMemo(() => {
    const github = profile?.socials?.find(
      (s) => s.name.toLowerCase() === "github",
    );
    const linkedin = profile?.socials?.find(
      (s) => s.name.toLowerCase() === "linkedin",
    );
    return { github, linkedin };
  }, [profile]);

  const safeSkills = Array.isArray(skills) ? skills : [];
  const safeTestimonials = Array.isArray(testimonialsRes?.data)
    ? testimonialsRes.data
    : [];

  const handleScrollToProjects = () => {
    const element = document.getElementById("projects");
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", height: "100vh" }}>
        <CircularProgress size={50} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <SEO title="Portfolio" />
      <Box
        component="section"
        id="home"
        ref={homeRef}
        sx={{
          minHeight: "100vh",
          width: "100%",
          position: "relative",
          display: "flex",
          alignItems: "center",
          bgcolor: "transparent",
          userSelect: "none",
          cursor: "grab",
          touchAction: "pan-y !important",
          "&:active": {
            cursor: "grabbing",
          },
        }}
      >
        <Suspense fallback={null}>
          <Interactive3D rootRef={homeRef} />
        </Suspense>

        <Container
          component="main"
          sx={{
            position: "relative",
            zIndex: 10,
            height: "100%",
            pointerEvents: "none",
          }}
        >
          <div className="flex flex-col justify-center lg:justify-between h-full pt-28 pb-16">
            <div className="pointer-events-auto mt-8 lg:mt-20">
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="max-w-2xl text-center md:text-left">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <p className="text-primary-400 font-semibold tracking-wide uppercase text-sm mb-2">
                      Hi, my name is
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.4,
                      type: "spring",
                      stiffness: 100,
                    }}
                  >
                    <h1 className="heading-display text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-secondary-500 bg-clip-text text-transparent">
                      {profile?.full_name}.
                    </h1>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <h2 className="heading-display text-2xl md:text-4xl font-bold dark:text-gray-300 text-gray-700 mb-6">
                      {profile?.headline}
                    </h2>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    <p className="dark:text-gray-400 text-gray-600 text-lg md:text-xl max-w-xl leading-relaxed mb-8 text-balance">
                      {profile?.bio?.split("\n")[0]}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1 }}
                  >
                    <div className="flex flex-row gap-4 justify-center md:justify-start">
                      {socialLinks.github && (
                        <motion.a
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.95 }}
                          href={socialLinks.github.url}
                          target="_blank"
                          className="p-3 glass rounded-full dark:text-white text-gray-800 hover:text-primary-400 dark:hover:text-primary-400 transition-colors"
                        >
                          <GitHubIcon />
                        </motion.a>
                      )}
                      {socialLinks.linkedin && (
                        <motion.a
                          whileHover={{ scale: 1.1, rotate: -5 }}
                          whileTap={{ scale: 0.95 }}
                          href={socialLinks.linkedin.url}
                          target="_blank"
                          className="p-3 glass rounded-full dark:text-white text-gray-800 hover:text-secondary-400 dark:hover:text-secondary-400 transition-colors"
                        >
                          <LinkedInIcon />
                        </motion.a>
                      )}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Bento Box Elements - Right Side/Bottom */}
            <div className="flex justify-end mt-12 lg:mt-0 pointer-events-auto mb-8 hidden md:flex">
              <div className="flex flex-col gap-6 max-w-lg w-full">
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="w-full"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="glass-heavy p-6 md:p-8 rounded-3xl border border-gray-200 dark:border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 dark:from-primary-500/10 dark:to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <h3 className="heading-display text-2xl font-bold mb-4 dark:text-white text-gray-900">
                      Tech Stack
                    </h3>
                    <motion.div
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                      className="flex flex-wrap gap-2 relative z-10"
                    >
                      {safeSkills.slice(0, 8).map((skill, index) => (
                        <motion.div
                          key={skill.id}
                          variants={chipVariants}
                          custom={index}
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="px-4 py-2 rounded-full border border-primary-500/30 text-sm font-medium text-primary-600 dark:text-primary-300 bg-primary-500/10 backdrop-blur-md">
                            {skill.name}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                  className="w-full"
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="glass-heavy p-6 md:p-8 rounded-3xl border border-gray-200 dark:border-white/5 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-secondary-500/5 to-primary-500/5 dark:from-secondary-500/10 dark:to-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <h3 className="heading-display text-2xl font-bold dark:text-white text-gray-900 mb-2 relative z-10">
                      Explore My Work
                    </h3>
                    <p className="dark:text-gray-400 text-gray-600 mb-6 relative z-10">
                      Check out my latest projects and experiments.
                    </p>
                    <motion.button
                      onClick={handleScrollToProjects}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-3 bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 font-semibold rounded-full transition-colors relative z-10 flex items-center justify-center mx-auto gap-2 shadow-md"
                    >
                      View Projects <ArrowForwardIcon fontSize="small" />
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </Container>
      </Box>

      <Box
        component="section"
        id="projects"
        sx={{
          py: 10,
          minHeight: "100vh",
          bgcolor: "background.default",
          position: "relative",
        }}
      >
        <SectionBackground />
        <Container sx={{ position: "relative", zIndex: 1 }}>
          <LazySection>
            <Suspense fallback={null}>
              <ProjectsSection />
            </Suspense>
          </LazySection>
        </Container>
      </Box>

      <Box
        component="section"
        id="about"
        sx={{
          py: 10,
          minHeight: "100vh",
          bgcolor: "transparent",
          position: "relative",
        }}
      >
        <SectionBackground />
        <Container sx={{ position: "relative", zIndex: 1 }}>
          <LazySection>
            <Suspense fallback={null}>
              <AboutSection />
            </Suspense>
          </LazySection>
        </Container>
      </Box>

      {safeTestimonials.length > 0 && (
        <Box
          component="section"
          id="testimonials"
          sx={{
            py: 10,
            bgcolor: "transparent",
            position: "relative",
          }}
        >
          <SectionBackground />
          <Container sx={{ position: "relative", zIndex: 1 }}>
            <LazySection>
              <Suspense fallback={null}>
                <TestimonialSection testimonials={safeTestimonials} />
              </Suspense>
            </LazySection>
          </Container>
        </Box>
      )}

      <Box
        component="section"
        id="contact-section"
        sx={{
          py: 10,
          minHeight: "60vh",
          bgcolor: "transparent",
          position: "relative",
        }}
      >
        <SectionBackground />
        <Container sx={{ position: "relative", zIndex: 1 }}>
          <LazySection>
            <Suspense fallback={null}>
              <ContactSection />
            </Suspense>
          </LazySection>
        </Container>
      </Box>
    </Box>
  );
}
