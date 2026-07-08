import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Box, Typography, Chip } from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import { Skill } from "../types";

interface SkillChipsProps {
  skills: Skill[];
  groupOrder?: string;
}

const getSkillIconUrl = (skillName: string): string => {
  const lower = skillName.toLowerCase().trim();

  const map: Record<string, string> = {
    "c#": "csharp",
    "c++": "cplusplus",
    ".net": "dotnet",
    netcore: "dotnet",
    "vb.net": "visualbasic",
    golang: "go",
    "node.js": "nodedotjs",
    nodejs: "nodedotjs",
    "express.js": "express",
    expressjs: "express",
    "vue.js": "vuedotjs",
    vuejs: "vuedotjs",
    "next.js": "nextdotjs",
    nextjs: "nextdotjs",
    "react.js": "react",
    reactjs: "react",
    "react native": "react",
    angularjs: "angular",
    mysql: "mysql",
    postgresql: "postgresql",
    postgres: "postgresql",
    mongodb: "mongodb",
    "microsoft sql server": "microsoftsqlserver",
    docker: "docker",
    kubernetes: "kubernetes",
    aws: "amazonaws",
    gcp: "googlecloud",
    azure: "microsoftazure",
    git: "git",
    github: "github",
    gitlab: "gitlab",
    "git & github": "github",
    html: "html5",
    css: "css3",
    tailwind: "tailwindcss",
    bootstrap: "bootstrap",
    sass: "sass",
    "material-ui": "mui",
    mui: "mui",
    figma: "figma",
    postman: "postman",
    linux: "linux",
    ubuntu: "ubuntu",
    jenkins: "jenkins",
    gorm: "go",
    "ci/cd": "githubactions",
    "ci/cd (continuous integration/deployment)": "githubactions",
    "restful api": "postman",
    api: "postman",
  };

  if (map[lower]) return `https://cdn.simpleicons.org/${map[lower]}`;

  const cleanSlug = lower
    .replace(/\+/g, "plus")
    .replace(/\./g, "dot")
    .replace(/[^a-z0-9]/g, "");

  return `https://cdn.simpleicons.org/${cleanSlug}`;
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 20 },
  },
};

const SkillChipItem = ({ skill }: { skill: Skill }) => {
  const [imgError, setImgError] = useState(false);
  const iconUrl = getSkillIconUrl(skill.name);

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.1, y: -4 }}
      whileTap={{ scale: 0.95 }}
    >
      <Chip
        label={skill.name}
        icon={
          !imgError ? (
            <Box
              component="img"
              src={iconUrl}
              alt={skill.name}
              sx={{
                width: 20,
                height: 20,
                objectFit: "contain",
                filter: (theme) =>
                  theme.palette.mode === "dark"
                    ? "invert(1) brightness(1.2)"
                    : "none",
              }}
              onError={() => setImgError(true)}
            />
          ) : (
            <CodeIcon sx={{ fontSize: 20 }} />
          )
        }
        sx={{
          px: 2,
          py: 2.5,
          height: "auto",
          fontSize: "0.95rem",
          fontWeight: 600,
          bgcolor: "background.paper",
          border: "2px solid",
          borderColor: "divider",
          transition: "all 0.3s",
          "& .MuiChip-icon": { ml: 1, mr: -0.5 },
          "&:hover": {
            borderColor: "primary.main",
            bgcolor: "primary.main",
            color: "primary.contrastText",
            boxShadow: "0 4px 12px rgba(124, 58, 237, 0.3)",
            "& img": { filter: "brightness(0) invert(1)" },
            "& .MuiSvgIcon-root": { color: "white" },
          },
        }}
      />
    </motion.div>
  );
};

export default function SkillChips({ skills, groupOrder }: SkillChipsProps) {
  const groupedSkills: { [key: string]: Skill[] } = {};
  skills.forEach((skill) => {
    const groupName = skill.group.trim();
    if (!groupedSkills[groupName]) {
      groupedSkills[groupName] = [];
    }
    groupedSkills[groupName].push(skill);
  });

  const orderedGroups = Object.keys(groupedSkills);

  if (groupOrder) {
    try {
      const orderArray: string[] = JSON.parse(groupOrder);
      if (Array.isArray(orderArray) && orderArray.length > 0) {
        orderedGroups.sort((a, b) => {
          const indexA = orderArray.indexOf(a);
          const indexB = orderArray.indexOf(b);

          const posA = indexA !== -1 ? indexA : 9999;
          const posB = indexB !== -1 ? indexB : 9999;

          if (posA !== posB) return posA - posB;
          return a.localeCompare(b);
        });
      }
    } catch (e) {
      console.error(e);
    }
  } else {
    orderedGroups.sort();
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4, mt: 2 }}>
        {orderedGroups.map((group) => (
          <motion.div key={group} variants={itemVariants}>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1.5 }}
            >
              <Box
                sx={{
                  width: 4,
                  height: 24,
                  borderRadius: 1,
                  background: "linear-gradient(180deg, #7C3AED, #06B6D4)",
                }}
              />
              {group}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
              {groupedSkills[group].map((skill) => (
                <SkillChipItem key={skill.id} skill={skill} />
              ))}
            </Box>
          </motion.div>
        ))}
      </Box>
    </motion.div>
  );
}
