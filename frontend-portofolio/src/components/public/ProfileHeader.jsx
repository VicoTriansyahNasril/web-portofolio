// src/components/public/ProfileHeader.jsx
import { Avatar, Box, Button, Chip, Stack, Typography, Fade } from '@mui/material'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded'
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded'
import { fileUrl } from '../../utils/url'

export default function ProfileHeader({ profile }) {
    if (!profile) return null
    return (
        <Fade in timeout={500}>
            <Box sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, bgcolor: 'background.paper', boxShadow: 1 }}>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 2, sm: 3 }}
                    alignItems="center"
                >
                    <Avatar
                        src={fileUrl(profile.photo_url)}
                        alt={profile.full_name}
                        sx={{
                            width: { xs: 80, sm: 96 },
                            height: { xs: 80, sm: 96 },
                            border: '3px solid',
                            borderColor: 'primary.main',
                        }}
                    />
                    <Stack spacing={1.5} sx={{ flex: 1, width: '100%', textAlign: { xs: 'center', sm: 'left' } }}>
                        <Typography variant="h5" fontWeight={800}>{profile.full_name}</Typography>
                        <Typography color="text.secondary">{profile.headline}</Typography>
                        <Stack
                            direction="row"
                            spacing={1}
                            useFlexGap
                            flexWrap="wrap"
                            justifyContent={{ xs: 'center', sm: 'flex-start' }}
                        >
                            {profile.location && (
                                <Chip
                                    size="small"
                                    icon={<LocationOnRoundedIcon />}
                                    label={profile.location}
                                    sx={{ fontWeight: 600 }}
                                />
                            )}
                            {(profile.socials || []).map((s) => (
                                <Chip
                                    key={s.id || s.url}
                                    size="small"
                                    clickable
                                    component="a"
                                    href={s.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    label={s.name}
                                    onDelete={() => window.open(s.url, '_blank')}
                                    deleteIcon={<LaunchRoundedIcon />}
                                    sx={{ fontWeight: 600 }}
                                />
                            ))}
                        </Stack>
                    </Stack>
                    {profile.resume_url && (
                        <Button
                            variant="contained"
                            href={fileUrl(profile.resume_url)}
                            target="_blank"
                            startIcon={<FileDownloadRoundedIcon />}
                            sx={{ width: { xs: '100%', sm: 'auto' }, flexShrink: 0 }}
                        >
                            Unduh CV
                        </Button>
                    )}
                </Stack>
            </Box>
        </Fade>
    )
}