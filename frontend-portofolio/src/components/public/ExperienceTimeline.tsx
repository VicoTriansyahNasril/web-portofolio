import { Box, Typography, Chip, Stack } from '@mui/material';
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
    if (type === 'Pekerjaan Penuh Waktu' || type === 'Magang') return <WorkIcon fontSize="small" />;
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
        const aDate = new Date(a.start_date);
        const bDate = new Date(b.start_date);
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
        <Box sx={{ position: 'relative', pl: 3, borderLeft: '2px solid', borderColor: 'divider' }}>
            {sortedExperiences.map((exp, index) => (
                <Box
                    key={exp.id}
                    component={motion.div}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    sx={{ position: 'relative', pb: 4, '&:last-child': { pb: 0 } }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            left: -17,
                            top: 4,
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: (t) => t.palette[getTypeColor(exp.type)].main,
                            border: '2px solid',
                            borderColor: 'background.paper',
                            boxShadow: (t) => `0 0 0 4px ${t.palette[getTypeColor(exp.type)].main}40`,
                            zIndex: 1,
                        }}
                    />

                    <Stack spacing={1}>
                        <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.3 }}>
                            {exp.title}
                        </Typography>
                        <Typography variant="body1" color="primary.main" fontWeight={600}>
                            {exp.entity_name}
                        </Typography>
                        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                            <Chip
                                icon={<CalendarTodayIcon fontSize="small" />}
                                label={`${formatDate(exp.start_date)} - ${formatDate(exp.end_date)}`}
                                variant="outlined"
                                size="small"
                                sx={{ fontWeight: 500 }}
                            />
                            <Chip
                                icon={getTypeIcon(exp.type)}
                                label={exp.type}
                                color={getTypeColor(exp.type)}
                                size="small"
                                sx={{ fontWeight: 600 }}
                            />
                        </Stack>
                        {exp.description && (
                            <Typography variant="body2" sx={{ pt: 1, whiteSpace: 'pre-wrap', color: 'text.secondary' }}>
                                {exp.description}
                            </Typography>
                        )}
                    </Stack>
                </Box>
            ))}
        </Box>
    );
}