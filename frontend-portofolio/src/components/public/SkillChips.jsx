// src/components/public/SkillChips.jsx
import { Box, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';

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

function SkillGroup({ title, items }) {
    if (!items?.length) return null;

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.secondary', borderBottom: 1, borderColor: 'divider', pb: 1 }}>
                {title}
            </Typography>
            <Box
                component={motion.div}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <Grid container spacing={2}>
                    {items.map((skill) => (
                        <Grid xs={6} sm={4} md={3} key={skill.id || skill.name}>
                            <motion.div variants={itemVariants}>
                                <Typography sx={{ fontSize: '1.1rem' }}>
                                    {skill.name}
                                </Typography>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}

export default function SkillChips({ skills = [], groupOrder = [] }) {
    const grouped = skills.reduce((acc, s) => {
        const g = s.group || 'Lainnya';
        acc[g] = acc[g] || [];
        acc[g].push(s);
        return acc;
    }, {});

    const orderedGroups = groupOrder.filter(group => grouped[group]);
    const remainingGroups = Object.keys(grouped).filter(group => !orderedGroups.includes(group));
    const finalGroupOrder = [...orderedGroups, ...remainingGroups];

    return (
        <Box>
            {finalGroupOrder.map((key) => (
                <SkillGroup key={key} title={key} items={grouped[key]} />
            ))}
        </Box>
    );
}