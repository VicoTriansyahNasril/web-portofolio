import { useMemo } from 'react';
import { Box, Container, Typography, Stack, Link } from '@mui/material';
import { usePublicData } from '@/hooks/usePublicData';
import type { Profile, Social } from '../../types';

interface SocialLinks {
    github: Social | null;
    linkedin: Social | null;
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
        <Box className="app-footer" component="footer" sx={{ py: 3, mt: 'auto' }}>
            <Container maxWidth="lg">
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={1}
                    sx={{
                        color: (t) => (t.palette.mode === 'dark' ? 'grey.500' : 'text.secondary'),
                        opacity: profile ? 1 : 0,
                        transition: 'opacity 0.3s ease-in-out',
                    }}
                >
                    <Typography variant="body2">© {new Date().getFullYear()} {profile?.full_name || 'Vico Triansyah Nasril'}</Typography>
                    {socialLinks.github && (
                        <>
                            <Typography variant="body2">·</Typography>
                            <Link href={socialLinks.github.url} target="_blank" variant="body2" color="inherit">
                                GitHub
                            </Link>
                        </>
                    )}
                    {socialLinks.linkedin && (
                        <>
                            <Typography variant="body2">·</Typography>
                            <Link href={socialLinks.linkedin.url} target="_blank" variant="body2" color="inherit">
                                LinkedIn
                            </Link>
                        </>
                    )}
                </Stack>
            </Container>
        </Box>
    );
}