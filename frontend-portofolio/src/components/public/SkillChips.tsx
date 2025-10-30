import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Skill } from '../../types';

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

interface SkillGroupProps {
    title: string;
    items: Skill[];
}

function SkillGroup({ title, items }: SkillGroupProps) {
    if (!items?.length) return null;

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.secondary', borderBottom: 1, borderColor: 'divider', pb: 1 }}>
                {title}
            </Typography>
            <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-8 gap-y-4"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                {items.map((skill) => (
                    <motion.div key={skill.id} variants={itemVariants}>
                        <Typography sx={{ fontSize: '1.1rem' }}>
                            {skill.name}
                        </Typography>
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