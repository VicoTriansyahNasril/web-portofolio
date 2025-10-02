/* eslint-disable no-unused-vars */
// src/components/public/ExperienceTimeline.jsx
import { Box, Typography, Stack, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import SchoolIcon from '@mui/icons-material/School';
import GroupsIcon from '@mui/icons-material/Groups';

const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
};

const getIcon = (type) => {
    if (type === 'Pendidikan') return <SchoolIcon />;
    if (type === 'Organisasi') return <GroupsIcon />;
    return <BusinessCenterIcon />;
};

export default function ExperienceTimeline({ experiences = [] }) {
    if (!experiences.length) return null;

    return (
        <Box sx={{ position: 'relative', '&::before': { content: '""', position: 'absolute', left: '19px', top: 0, bottom: 0, width: '2px', bgcolor: 'divider' } }}>
            {experiences.map((item, index) => (
                <motion.div
                    key={item.id || index}
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                >
                    <Stack direction="row" spacing={3} sx={{ mb: 4, position: 'relative' }}>
                        <Box sx={{ zIndex: 1, flexShrink: 0, width: 40, height: 40, borderRadius: '50%', display: 'grid', placeItems: 'center', bgcolor: 'background.paper', border: '2px solid', borderColor: 'divider' }}>
                            {getIcon(item.type)}
                        </Box>
                        <Box>
                            <Typography variant="body2" color="primary.main" fontWeight={600}>
                                {formatDate(item.start_date)} - {item.end_date ? formatDate(item.end_date) : 'Sekarang'}
                            </Typography>

                            {/* ================================================================= */}
                            {/* PERUBAHAN UTAMA: Menampilkan Judul dengan Label Tipe            */}
                            {/* ================================================================= */}
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
                                <Typography variant="h6" fontWeight={700}>{item.title}</Typography>
                                {(item.type === 'Magang' || item.type === 'Pekerjaan Penuh Waktu') && (
                                    <Chip label={item.type} color="primary" size="small" variant="outlined" />
                                )}
                            </Stack>

                            <Typography color="text.secondary" sx={{ mb: 1 }}>{item.entity_name} • {item.location}</Typography>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: 'text.secondary' }}>
                                {item.description}
                            </Typography>
                        </Box>
                    </Stack>
                </motion.div>
            ))}
        </Box>
    );
}