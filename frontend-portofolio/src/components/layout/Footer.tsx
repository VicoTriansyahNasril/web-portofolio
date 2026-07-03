import { useMemo } from 'react';
import { Box, Container, Typography, Stack, Link, Tooltip } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { usePublicData } from '@/hooks/usePublicData';
import { useActiveVisitors } from '@/hooks/useActiveVisitors';
import type { Profile, SocialLink } from '@/features/profile/types';

interface SocialLinks {
    github: SocialLink | null;
    linkedin: SocialLink | null;
}

export default function Footer() {
    const { data: profile } = usePublicData<Profile>('/api/profile');
    const activeVisitors = useActiveVisitors();

    const socialLinks = useMemo((): SocialLinks => {
        if (!profile?.socials) {
            return { github: null, linkedin: null };
        }
        const github = profile.socials.find(s => s.active && s.name.toLowerCase() === 'github') || null;
        const linkedin = profile.socials.find(s => s.active && s.name.toLowerCase() === 'linkedin') || null;
        return { github, linkedin };
    }, [profile]);

    return (
        <Box component="footer" sx={{ py: 3, mt: 'auto', borderTop: '1px solid', borderColor: 'divider' }}>
            <Container maxWidth="lg">
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                    sx={{
                        color: 'text.secondary',
                        opacity: profile ? 1 : 0,
                        transition: 'opacity 0.3s ease-in-out',
                    }}
                >
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2">© {new Date().getFullYear()} {profile?.full_name || 'Portfolio'}</Typography>
                        {socialLinks.github && (
                            <>
                                <Typography variant="body2">·</Typography>
                                <Link href={socialLinks.github.url} target="_blank" variant="body2" color="inherit" underline="hover">
                                    GitHub
                                </Link>
                            </>
                        )}
                        {socialLinks.linkedin && (
                            <>
                                <Typography variant="body2">·</Typography>
                                <Link href={socialLinks.linkedin.url} target="_blank" variant="body2" color="inherit" underline="hover">
                                    LinkedIn
                                </Link>
                            </>
                        )}
                    </Stack>

                    <Tooltip title="Live Active Visitors">
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ bgcolor: 'action.hover', px: 1.5, py: 0.5, borderRadius: 4 }}>
                            <Box sx={{ position: 'relative', display: 'flex' }}>
                                <CircleIcon sx={{ fontSize: 10, color: '#10B981' }} />
                                <Box sx={{
                                    position: 'absolute', inset: 0, borderRadius: '50%',
                                    bgcolor: '#10B981', opacity: 0.7,
                                    animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
                                }} />
                            </Box>
                            <Typography variant="caption" fontWeight={600}>
                                {activeVisitors} Online
                            </Typography>
                        </Stack>
                    </Tooltip>
                </Stack>
            </Container>
            <style>
                {`@keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }`}
            </style>
        </Box>
    );
}