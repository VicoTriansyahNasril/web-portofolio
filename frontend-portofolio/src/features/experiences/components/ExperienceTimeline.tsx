import { Box, Typography, Chip, Stack, Paper, useTheme, useMediaQuery } from '@mui/material'
import { motion } from 'framer-motion'
import WorkIcon from '@mui/icons-material/Work'
import SchoolIcon from '@mui/icons-material/School'
import GroupsIcon from '@mui/icons-material/Groups'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import type { Experience } from '../types'

interface ExperienceTimelineProps {
    experiences: Experience[]
}

const getTypeIcon = (type: string) => {
    if (type === 'Pekerjaan Penuh Waktu' || type === 'Magang') return <WorkIcon fontSize="small" />
    if (type === 'Organisasi') return <GroupsIcon fontSize="small" />
    if (type === 'Pendidikan') return <SchoolIcon fontSize="small" />
    return <WorkIcon fontSize="small" />
}

const getTypeColor = (type: string): 'primary' | 'secondary' | 'success' | 'info' => {
    if (type === 'Pekerjaan Penuh Waktu') return 'primary'
    if (type === 'Magang') return 'info'
    if (type === 'Organisasi') return 'secondary'
    if (type === 'Pendidikan') return 'success'
    return 'primary'
}

export default function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    const formatDate = (date: string | null): string => {
        if (!date) return 'Present'
        return new Date(date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short' })
    }

    const sortedExperiences = [...experiences].sort((a, b) => {
        const aDate = new Date(a.start_date)
        const bDate = new Date(b.start_date)
        return bDate.getTime() - aDate.getTime()
    })

    if (experiences.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography color="text.secondary">Belum ada data pengalaman</Typography>
            </Box>
        )
    }

    return (
        <Box sx={{ position: 'relative', py: 4, overflow: 'hidden' }}>
            {!isMobile && (
                <Box
                    sx={{
                        position: 'absolute',
                        left: '50%',
                        top: 0,
                        bottom: 0,
                        width: '2px',
                        bgcolor: 'divider',
                        transform: 'translateX(-50%)',
                        zIndex: 0
                    }}
                />
            )}

            <Stack spacing={isMobile ? 6 : 0}>
                {sortedExperiences.map((exp, index) => {
                    const isEven = index % 2 === 0
                    return (
                        <Box
                            key={exp.id}
                            sx={{
                                display: 'flex',
                                justifyContent: isMobile ? 'flex-start' : (isEven ? 'flex-end' : 'flex-start'),
                                position: 'relative',
                                mb: isMobile ? 0 : 4,
                                width: '100%'
                            }}
                        >
                            {!isMobile && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: '50%',
                                        top: 24,
                                        transform: 'translate(-50%, -50%)',
                                        zIndex: 2,
                                        bgcolor: 'background.default',
                                        p: 0.5,
                                        borderRadius: '50%',
                                        border: '2px solid',
                                        borderColor: 'divider'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 16,
                                            height: 16,
                                            borderRadius: '50%',
                                            bgcolor: `${getTypeColor(exp.type)}.main`,
                                            boxShadow: (t) => `0 0 0 4px ${t.palette[getTypeColor(exp.type)].main}30`
                                        }}
                                    />
                                </Box>
                            )}

                            <motion.div
                                initial={{ opacity: 0, x: isMobile ? -50 : (isEven ? -50 : 50) }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                style={{
                                    width: isMobile ? '100%' : '50%',
                                    paddingLeft: isMobile ? 0 : (isEven ? 0 : 40),
                                    paddingRight: isMobile ? 0 : (isEven ? 40 : 0),
                                    position: 'relative'
                                }}
                            >
                                {isMobile && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            left: -20,
                                            top: 24,
                                            bottom: -40,
                                            width: '2px',
                                            bgcolor: 'divider',
                                            zIndex: 0
                                        }}
                                    />
                                )}

                                {isMobile && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            left: -27,
                                            top: 24,
                                            width: 16,
                                            height: 16,
                                            borderRadius: '50%',
                                            bgcolor: `${getTypeColor(exp.type)}.main`,
                                            zIndex: 1,
                                            boxShadow: (t) => `0 0 0 4px ${t.palette[getTypeColor(exp.type)].main}30`
                                        }}
                                    />
                                )}

                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: 4,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        background: (t) => t.palette.mode === 'dark'
                                            ? 'linear-gradient(135deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.7) 100%)'
                                            : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(241,245,249,0.9) 100%)',
                                        backdropFilter: 'blur(10px)',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: (t) => t.palette.mode === 'dark' ? '0 10px 30px -10px rgba(0,0,0,0.5)' : '0 10px 30px -10px rgba(0,0,0,0.1)',
                                            borderColor: `${getTypeColor(exp.type)}.main`
                                        }
                                    }}
                                >
                                    <Stack spacing={2}>
                                        <Box>
                                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                                                <Box>
                                                    <Typography variant="h6" fontWeight={800} lineHeight={1.2} mb={0.5}>
                                                        {exp.title}
                                                    </Typography>
                                                    <Typography variant="subtitle1" color="primary.main" fontWeight={600}>
                                                        {exp.entity_name}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </Box>

                                        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                                            <Chip
                                                icon={<CalendarTodayIcon sx={{ fontSize: '0.9rem !important' }} />}
                                                label={`${formatDate(exp.start_date)} - ${formatDate(exp.end_date)}`}
                                                size="small"
                                                variant="outlined"
                                                sx={{ borderRadius: 2, borderColor: 'divider' }}
                                            />
                                            <Chip
                                                icon={getTypeIcon(exp.type)}
                                                label={exp.type}
                                                color={getTypeColor(exp.type)}
                                                size="small"
                                                sx={{ borderRadius: 2, fontWeight: 600 }}
                                            />
                                            {exp.location && (
                                                <Chip
                                                    label={exp.location}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ borderRadius: 2, borderColor: 'divider' }}
                                                />
                                            )}
                                        </Stack>

                                        {exp.description && (
                                            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                                                {exp.description}
                                            </Typography>
                                        )}
                                    </Stack>
                                </Paper>
                            </motion.div>
                        </Box>
                    )
                })}
            </Stack>
        </Box>
    )
}