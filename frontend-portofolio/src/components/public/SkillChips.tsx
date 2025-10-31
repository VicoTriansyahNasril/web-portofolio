import { Box, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { Skill } from '../../types';
import CodeIcon from '@mui/icons-material/Code';

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
};

interface SkillGroupProps {
    title: string;
    items: Skill[];
}

function SkillGroup({ title, items }: SkillGroupProps) {
    if (!items?.length) return null;

    return (
        <Box sx={{ mb: 4, '&:last-child': { mb: 0 } }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                {title}
            </Typography>
            <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                {items.map((skill) => (
                    <motion.div key={skill.id} variants={itemVariants}>
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 1.5,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                transition: 'all 0.2s ease-in-out',
                                bgcolor: 'action.hover',
                                '&:hover': {
                                    bgcolor: 'primary.main',
                                    color: 'primary.contrastText',
                                    transform: 'scale(1.05)',
                                },
                            }}
                        >
                            <CodeIcon fontSize="small" />
                            <Typography sx={{ fontWeight: 500 }}>
                                {skill.name}
                            </Typography>
                        </Paper>
                    </motion.div>
                ))}
            </motion.div>
        </Box>
    );
}

interface SkillChipsProps {
    skills: Skill[];
    groupOrder?: string[];
}

export default function SkillChips({ skills = [], groupOrder = [] }: SkillChipsProps) {
    const grouped = skills.reduce((acc, s) => {
        const g = s.group || 'Lainnya';
        if (!acc[g]) {
            acc[g] = [];
        }
        acc[g].push(s);
        return acc;
    }, {} as Record<string, Skill[]>);

    const orderedGroups = groupOrder.filter(group => grouped[group]);
    const remainingGroups = Object.keys(grouped).filter(group => !orderedGroups.includes(group)).sort();
    const finalGroupOrder = [...orderedGroups, ...remainingGroups];

    return (
        <Box>
            {finalGroupOrder.map((key) => (
                <SkillGroup key={key} title={key} items={grouped[key]} />
            ))}
        </Box>
    );
}