//src/components/admin/ProjectPreview.jsx
import { Dialog, DialogTitle, DialogContent, Typography, Chip, Stack, Box, Divider, Button } from '@mui/material'
import { marked } from 'marked'
import { fileUrl } from '../../utils/url'

export default function ProjectPreview({ open, onClose, project }) {
    if (!project) return null

    const repo = project.repo_url
    const demo = project.demo_url
    const gallery = Array.isArray(project.gallery) ? project.gallery : []

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {project.title || '(Tanpa judul)'}
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    {project.role && <Chip size="small" label={project.role} color="info" />}
                    <Chip
                        size="small"
                        label={project.status || 'draft'}
                        color={(project.status === 'published') ? 'success' : 'default'}
                        variant="outlined"
                    />
                </Stack>
            </DialogTitle>
            <DialogContent dividers>
                {project.cover_url && (
                    <Box
                        component="img"
                        src={fileUrl(project.cover_url)}
                        alt="cover"
                        sx={{ width: '100%', borderRadius: 1, mb: 2 }}
                    />
                )}

                {project.summary && (
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        {project.summary}
                    </Typography>
                )}

                {(repo || demo) && (
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        {repo && <Button variant="outlined" href={repo} target="_blank" rel="noreferrer">Repository</Button>}
                        {demo && <Button variant="contained" href={demo} target="_blank" rel="noreferrer">Live Demo</Button>}
                    </Stack>
                )}

                {project.body && (
                    <Box
                        sx={{
                            '& h1,& h2,& h3': { mt: 2, mb: 1 },
                            '& p': { mb: 1.5 },
                            '& a': { textDecoration: 'underline' },
                            '& img': { maxWidth: '100%', borderRadius: 1 }
                        }}
                        dangerouslySetInnerHTML={{ __html: marked(project.body) }}
                    />
                )}

                {gallery.length > 0 && (
                    <>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>Galeri</Typography>
                        <Stack direction="row" gap={2} flexWrap="wrap">
                            {gallery.map((url, i) => (
                                <Box key={i} component="img" src={fileUrl(url)} alt={`gal-${i}`} sx={{ width: 180, borderRadius: 1 }} />
                            ))}
                        </Stack>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
