import { Box, Typography, Chip, Paper, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import GroupsIcon from '@mui/icons-material/Groups';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import type { Experience } from '@/types';

interface ExperienceTimelineProps {
    experiences: Experience[];
}

const getTypeIcon = (type: string) => {
    if (type === 'Pekerjaan Penuh Waktu') return <WorkIcon fontSize="small" />;
    if (type === 'Magang') return <WorkIcon fontSize="small" />;
    if (type === 'Organisasi') return <GroupsIcon fontSize="small" />;
    if (type === 'Pendidikan') return <SchoolIcon fontSize="small" />;
    return <WorkIcon fontSize="small" />;
};

const getTypeColor = (type: string): 'primary' | 'secondary' | 'success' | 'info' => {
    if (type === 'Pekerjaan Penuh Waktu') return 'primary';
    if (type === 'Magang') return 'info';
    if (type === 'Organisasi') return 'secondary';
    if (type === 'Pendidikan') return 'success';
    return 'primary';
};

export default function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
    const formatDate = (date: string | null): string => {
        if (!date) return 'Present';
        return new Date(date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short' });
    };

    const sortedExperiences = [...experiences].sort((a, b) => {
        const aDate = a.end_date === null ? new Date() : new Date(a.start_date);
        const bDate = b.end_date === null ? new Date() : new Date(b.start_date);
        return bDate.getTime() - aDate.getTime();
    });

    if (experiences.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography color="text.secondary">Belum ada data pengalaman</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ position: 'relative' }}>
            <Box
                sx={{
                    position: 'absolute',
                    left: { xs: 16, sm: 20 },
                    top: 0,
                    bottom: 0,
                    width: '2px',
                    background: 'linear-gradient(to bottom, rgba(124,58,237,0.8), rgba(6,182,212,0.8))',
                }}
            />

            <Stack spacing={4}>
                {sortedExperiences.map((exp, index) => (
                    <Box
                        key={exp.id}
                        component={motion.div}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        sx={{ position: 'relative', pl: { xs: 6, sm: 8 } }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                left: { xs: 12, sm: 16 },
                                top: 16,
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                bgcolor: 'primary.main',
                                border: '4px solid',
                                borderColor: 'background.paper',
                                boxShadow: '0 0 0 4px rgba(124,58,237,0.2)',
                                zIndex: 1,
                            }}
                        />

                        <Paper
                            sx={{
                                p: { xs: 2, md: 3 },
                                borderRadius: 3,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                transition: 'all 0.3s',
                                '&:hover': {
                                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                                    transform: 'translateY(-2px)',
                                },
                            }}
                        >
                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                    <Box sx={{ flex: 1, minWidth: 200 }}>
                                        <Typography variant="h6" fontWeight={700} gutterBottom>
                                            {exp.title}
                                        </Typography>
                                        <Typography variant="body1" color="primary.main" fontWeight={600}>
                                            {exp.entity_name}
                                        </Typography>
                                    </Box>

                                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                        <Chip
                                            icon={getTypeIcon(exp.type)}
                                            label={exp.type}
                                            color={getTypeColor(exp.type)}
                                            size="small"
                                            sx={{ fontWeight: 600 }}
                                        />
                                        <Chip
                                            icon={<CalendarTodayIcon fontSize="small" />}
                                            label={`${formatDate(exp.start_date)} - ${formatDate(exp.end_date)}`}
                                            variant="outlined"
                                            size="small"
                                            sx={{ fontWeight: 500 }}
                                        />
                                    </Stack>
                                </Box>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        whiteSpace: 'pre-wrap',
                                        lineHeight: 1.7,
                                    }}
                                >
                                    {exp.description}
                                </Typography>
                            </Stack>
                        </Paper>
                    </Box>
                ))}
            </Stack>
        </Box>
    );
}