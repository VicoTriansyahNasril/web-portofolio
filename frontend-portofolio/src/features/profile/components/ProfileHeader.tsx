import { ReactElement } from 'react'
import { Avatar, Box, Button, Chip, Stack, Typography, Paper } from '@mui/material'
import { motion } from 'framer-motion'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import DownloadIcon from '@mui/icons-material/Download'
import LaunchIcon from '@mui/icons-material/Launch'
import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import InstagramIcon from '@mui/icons-material/Instagram'
import TwitterIcon from '@mui/icons-material/Twitter'
import EmailIcon from '@mui/icons-material/Email'
import { Profile } from '../types'
import { transformedFileUrl } from '@/utils/url'

const iconMap: Record<string, ReactElement> = {
    github: <GitHubIcon />,
    linkedin: <LinkedInIcon />,
    instagram: <InstagramIcon />,
    twitter: <TwitterIcon />,
    email: <EmailIcon />,
    mail: <EmailIcon />,
}

export default function ProfileHeader({ profile }: { profile: Profile | null }) {
    if (!profile) return null

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Paper elevation={0} className="p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-cyan-600" />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} alignItems={{ xs: 'center', sm: 'flex-start' }}>
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}>
                        <Avatar
                            src={transformedFileUrl(profile.photo_url, { width: 200 })}
                            alt={profile.full_name}
                            sx={{ width: { xs: 120, sm: 140 }, height: { xs: 120, sm: 140 }, border: '4px solid', borderColor: 'primary.main' }}
                        />
                    </motion.div>
                    <Stack spacing={2} flex={1} textAlign={{ xs: 'center', sm: 'left' }} width="100%">
                        <Box>
                            <Typography variant="h3" fontWeight={800} className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-600 mb-2">
                                {profile.full_name}
                            </Typography>
                            <Typography variant="h6" color="text.secondary" fontWeight={500}>
                                {profile.headline}
                            </Typography>
                        </Box>
                        <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent={{ xs: 'center', sm: 'flex-start' }} gap={1}>
                            {profile.location && <Chip icon={<LocationOnIcon />} label={profile.location} />}
                            {profile.socials?.filter(s => s.active).map((s, i) => (
                                <Chip
                                    key={i}
                                    icon={iconMap[s.icon] || <LaunchIcon />}
                                    label={s.name}
                                    clickable
                                    component="a"
                                    href={s.url}
                                    target="_blank"
                                />
                            ))}
                        </Stack>
                        {profile.resume_url && (
                            <Box pt={1}>
                                <Button variant="contained" href={transformedFileUrl(profile.resume_url)} target="_blank" startIcon={<DownloadIcon />}>
                                    Download CV
                                </Button>
                            </Box>
                        )}
                    </Stack>
                </Stack>
            </Paper>
        </motion.div>
    )
}