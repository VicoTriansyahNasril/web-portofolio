//src/components/layout/Footer.jsx
import { useEffect, useState, useMemo } from 'react';
import { Box, Container, Typography, Stack, Link } from '@mui/material';
import { fetchPublicProfile } from '../../api/profile';

export default function Footer() {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await fetchPublicProfile();
                setProfile(data);
            } catch (error) {
                console.error("Failed to fetch profile for footer:", error);
            }
        };
        loadProfile();
    }, []);
    const socialLinks = useMemo(() => {
        if (!profile?.socials) {
            return { github: null, linkedin: null };
        }
        const github = profile.socials.find(s => s.active && s.name.toLowerCase() === 'github');
        const linkedin = profile.socials.find(s => s.active && s.name.toLowerCase() === 'linkedin');
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