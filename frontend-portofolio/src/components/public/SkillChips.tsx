import { motion, Variants } from 'framer-motion'
import { Box, Typography, Chip } from '@mui/material'
import { Skill } from '../../types'

interface SkillChipsProps {
    skills: Skill[]
}

const getSkillIcon = (skillName: string): string => {
    const name = skillName.toLowerCase().trim()
    const iconMap: Record<string, string> = {
        'go': 'go', 'golang': 'go', 'laravel': 'laravel', 'nodejs': 'nodedotjs',
        'node.js': 'nodedotjs', 'node': 'nodedotjs', 'python': 'python',
        'spring boot': 'springboot', 'springboot': 'springboot', 'gorm': 'go',
        'mysql': 'mysql', 'postgresql': 'postgresql', 'postgres': 'postgresql',
        'sqlalchemy': 'sqlalchemy', 'ci/cd': 'githubactions', 'docker': 'docker',
        'git': 'git', 'github': 'github', 'next.js': 'nextdotjs', 'nextjs': 'nextdotjs',
        'react': 'react', 'reactjs': 'react', 'vue.js': 'vuedotjs', 'vuejs': 'vuedotjs',
        'vue': 'vuedotjs', 'flutter': 'flutter', 'dart': 'dart', 'javascript': 'javascript',
        'typescript': 'typescript', 'html': 'html5', 'html5': 'html5', 'css': 'css3',
        'css3': 'css3', 'tailwind': 'tailwindcss', 'tailwindcss': 'tailwindcss',
        'bootstrap': 'bootstrap', 'sass': 'sass', 'scss': 'sass',
        'git & github': 'github',
        'ci/cd (continuous integration/deployment)': 'githubactions',
        'express': 'express', 'expressjs': 'express', 'nestjs': 'nestjs',
        'django': 'django', 'fastapi': 'fastapi', 'flask': 'flask', 'redis': 'redis',
        'mongodb': 'mongodb', 'firebase': 'firebase', 'aws': 'amazonaws',
        'gcp': 'googlecloud', 'azure': 'microsoftazure', 'kubernetes': 'kubernetes',
        'jenkins': 'jenkins', 'gitlab': 'gitlab', 'nginx': 'nginx', 'apache': 'apache',
        'linux': 'linux', 'ubuntu': 'ubuntu', 'debian': 'debian', 'centos': 'centos',
        'java': 'openjdk', 'kotlin': 'kotlin', 'swift': 'swift', 'c++': 'cplusplus',
        'c#': 'csharp', 'php': 'php', 'ruby': 'ruby', 'rust': 'rust',
        'graphql': 'graphql', 'rest': 'swagger', 'restful': 'swagger', 'api': 'swagger',
        'figma': 'figma', 'adobe xd': 'adobexd', 'photoshop': 'adobephotoshop',
        'illustrator': 'adobeillustrator', 'material-ui': 'mui', 'mui': 'mui',
        'ant design': 'antdesign', 'chakra ui': 'chakraui', 'redux': 'redux',
        'mobx': 'mobx', 'webpack': 'webpack', 'vite': 'vite', 'babel': 'babel',
        'jest': 'jest', 'cypress': 'cypress', 'playwright': 'playwright',
        'storybook': 'storybook', 'swagger': 'swagger', 'postman': 'postman',
    }
    return iconMap[name] || 'code'
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 20 } }
}

export default function SkillChips({ skills }: SkillChipsProps) {
    const groupedSkills: { [key: string]: Skill[] } = {};
    skills.forEach(skill => {
        if (!groupedSkills[skill.group]) {
            groupedSkills[skill.group] = [];
        }
        groupedSkills[skill.group].push(skill);
    });

    // Dapatkan urutan grup dari skill pertama (karena sudah diurutkan dari backend)
    const orderedGroups = [...new Map(skills.map(item => [item.group, item])).keys()];

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 2 }}>
                {orderedGroups.map((group) => (
                    <motion.div key={group} variants={itemVariants}>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}
                        >
                            <Box
                                sx={{
                                    width: 4, height: 24, borderRadius: 1,
                                    background: 'linear-gradient(180deg, #7C3AED, #06B6D4)'
                                }}
                            />
                            {group}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                            {groupedSkills[group].map((skill, index) => {
                                const iconSlug = getSkillIcon(skill.name)
                                return (
                                    <motion.div
                                        key={skill.id}
                                        variants={itemVariants}
                                        custom={index}
                                        whileHover={{ scale: 1.1, y: -4 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Chip
                                            icon={
                                                <Box
                                                    component="img"
                                                    src={`https://cdn.simpleicons.org/${iconSlug}`}
                                                    alt={skill.name}
                                                    sx={{
                                                        width: 20, height: 20, objectFit: 'contain',
                                                        filter: (theme) => theme.palette.mode === 'dark' ? 'invert(1) brightness(1.2)' : 'none'
                                                    }}
                                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                                                />
                                            }
                                            label={skill.name}
                                            sx={{
                                                px: 2, py: 2.5, height: 'auto', fontSize: '0.95rem', fontWeight: 600,
                                                bgcolor: 'background.paper', border: '2px solid', borderColor: 'divider',
                                                transition: 'all 0.3s',
                                                '& .MuiChip-icon': { ml: 1, mr: -0.5 },
                                                '&:hover': {
                                                    borderColor: 'primary.main', bgcolor: 'primary.main', color: 'primary.contrastText',
                                                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
                                                    '& img': { filter: 'brightness(0) invert(1)' }
                                                }
                                            }}
                                        />
                                    </motion.div>
                                )
                            })}
                        </Box>
                    </motion.div>
                ))}
            </Box>
        </motion.div>
    )
}