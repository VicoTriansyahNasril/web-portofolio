import { Avatar, Box, Button, Chip, Stack, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';
import { fileUrl } from '@/utils/url';
import type { Profile } from '@/types';

interface ProfileHeaderProps {
    profile: Profile | null;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
    if (!profile) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 3, md: 5 },
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(6,182,212,0.08) 100%)',
                    border: '1px solid',
                    borderColor: 'divider',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, #7C3AED 0%, #06B6D4 100%)',
                    },
                }}
            >
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 3, sm: 4 }}
                    alignItems={{ xs: 'center', sm: 'flex-start' }}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Avatar
                            src={fileUrl(profile.photo_url)}
                            alt={profile.full_name}
                            sx={{
                                width: { xs: 120, sm: 140 },
                                height: { xs: 120, sm: 140 },
                                border: '4px solid',
                                borderColor: 'primary.main',
                                boxShadow: '0 8px 24px rgba(124,58,237,0.3)',
                            }}
                        />
                    </motion.div>

                    <Stack spacing={2} sx={{ flex: 1, width: '100%', textAlign: { xs: 'center', sm: 'left' } }}>
                        <Box>
                            <Typography
                                variant="h3"
                                fontWeight={800}
                                sx={{
                                    fontSize: { xs: '1.75rem', md: '2.5rem' },
                                    mb: 1,
                                    background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                {profile.full_name}
                            </Typography>
                            <Typography
                                variant="h6"
                                color="text.secondary"
                                fontWeight={500}
                                sx={{ mb: 1 }}
                            >
                                {profile.headline}
                            </Typography>
                        </Box>

                        <Stack
                            direction="row"
                            spacing={1}
                            useFlexGap
                            flexWrap="wrap"
                            justifyContent={{ xs: 'center', sm: 'flex-start' }}
                        >
                            {profile.location && (
                                <Chip
                                    icon={<LocationOnRoundedIcon />}
                                    label={profile.location}
                                    size="medium"
                                    sx={{
                                        fontWeight: 600,
                                        bgcolor: 'background.paper',
                                        boxShadow: 1,
                                    }}
                                />
                            )}
                            {(profile.socials || []).map((s) => (
                                <Chip
                                    key={s.id || s.url}
                                    size="medium"
                                    clickable
                                    component="a"
                                    href={s.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    label={s.name}
                                    onDelete={() => window.open(s.url, '_blank')}
                                    deleteIcon={<LaunchRoundedIcon />}
                                    sx={{
                                        fontWeight: 600,
                                        bgcolor: 'background.paper',
                                        boxShadow: 1,
                                        '&:hover': {
                                            bgcolor: 'primary.main',
                                            color: 'primary.contrastText',
                                            '& .MuiChip-deleteIcon': {
                                                color: 'primary.contrastText',
                                            },
                                        },
                                    }}
                                />
                            ))}
                        </Stack>

                        {profile.resume_url && (
                            <Box sx={{ pt: 1 }}>
                                <Button
                                    variant="contained"
                                    href={fileUrl(profile.resume_url)}
                                    target="_blank"
                                    startIcon={<FileDownloadRoundedIcon />}
                                    size="large"
                                    sx={{
                                        width: { xs: '100%', sm: 'auto' },
                                        py: 1.5,
                                        px: 4,
                                        borderRadius: 2,
                                        fontWeight: 600,
                                        boxShadow: 3,
                                        background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
                                        '&:hover': {
                                            boxShadow: 6,
                                            transform: 'translateY(-2px)',
                                        },
                                        transition: 'all 0.3s',
                                    }}
                                >
                                    Unduh CV
                                </Button>
                            </Box>
                        )}
                    </Stack>
                </Stack>
            </Paper>
        </motion.div>
    );
}