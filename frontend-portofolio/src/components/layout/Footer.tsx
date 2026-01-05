import { useMemo } from 'react';
import { Box, Container, Typography, Stack, Link } from '@mui/material';
import { usePublicData } from '@/hooks/usePublicData';
import type { Profile, SocialLink } from '@/features/profile/types';

interface SocialLinks {
    github: SocialLink | null;
    linkedin: SocialLink | null;
}

export default function Footer() {
    const { data: profile } = usePublicData<Profile>('/api/profile');

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
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={1}
                    sx={{
                        color: 'text.secondary',
                        opacity: profile ? 1 : 0,
                        transition: 'opacity 0.3s ease-in-out',
                    }}
                >
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
            </Container>
        </Box>
    );
}