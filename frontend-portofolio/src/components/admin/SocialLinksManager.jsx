// src/components/admin/SocialLinksManager.jsx
import {
    Box, Stack, TextField, Switch, FormControlLabel, IconButton, Button, Typography, Paper
} from '@mui/material'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import DeleteIcon from '@mui/icons-material/Delete'

export default function SocialLinksManager({ links = [], onChange }) {
    const updateLink = (index, field, value) => {
        const newLinks = [...links]
        newLinks[index] = { ...newLinks[index], [field]: value }
        onChange(newLinks)
    }

    const addLink = () => {
        const newLinks = [...links, { name: '', url: '', icon: '', active: true }]
        onChange(newLinks)
    }

    const removeLink = (index) => {
        const newLinks = links.filter((_, i) => i !== index)
        onChange(newLinks)
    }

    return (
        <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={600}>Tautan Sosial</Typography>
            <AnimatePresence>
                {links.map((link, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -30, transition: { duration: 0.2 } }}
                    >
                        <Paper variant="outlined" sx={{ p: 2 }}>
                            <Stack spacing={2}>
                                <Stack direction="row" spacing={2}>
                                    <TextField
                                        size="small"
                                        label="Nama"
                                        value={link.name}
                                        onChange={(e) => updateLink(i, 'name', e.target.value)}
                                        fullWidth
                                    />
                                    <TextField
                                        size="small"
                                        label="Icon (opsional)"
                                        value={link.icon}
                                        onChange={(e) => updateLink(i, 'icon', e.target.value)}
                                    />
                                </Stack>
                                <TextField
                                    size="small"
                                    label="URL"
                                    value={link.url}
                                    onChange={(e) => updateLink(i, 'url', e.target.value)}
                                />
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={link.active}
                                                onChange={(e) => updateLink(i, 'active', e.target.checked)}
                                            />
                                        }
                                        label="Aktif (tampil di publik)"
                                    />
                                    <IconButton color="error" onClick={() => removeLink(i)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Stack>
                            </Stack>
                        </Paper>
                    </motion.div>
                ))}
            </AnimatePresence>
            <Box>
                <Button startIcon={<AddCircleOutlineIcon />} onClick={addLink}>
                    Tambah Tautan
                </Button>
            </Box>
        </Stack>
    )
}