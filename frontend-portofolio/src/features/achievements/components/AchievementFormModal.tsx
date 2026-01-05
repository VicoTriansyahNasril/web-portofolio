import { useState, useEffect, FormEvent } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack } from '@mui/material'
import { Achievement } from '../types'

interface AchievementFormModalProps {
    open: boolean
    onClose: () => void
    onSubmit: (data: Partial<Achievement>) => Promise<void>
    initialData?: Achievement | null
}

export default function AchievementFormModal({ open, onClose, onSubmit, initialData }: AchievementFormModalProps) {
    const [formData, setFormData] = useState<Partial<Achievement>>({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (open) {
            setFormData(initialData ? {
                ...initialData,
                date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : ''
            } : {})
        }
    }, [initialData, open])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!formData.title || !formData.issuer || !formData.date) return

        setLoading(true)
        try {
            await onSubmit({
                ...formData,
                date: new Date(formData.date!).toISOString()
            })
            onClose()
        } finally {
            setLoading(false)
        }
    }

    if (!open) return null

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <form onSubmit={handleSubmit}>
                <DialogTitle fontWeight={700}>
                    {initialData?.id ? 'Edit Achievement' : 'Add Achievement'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField label="Title" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} required fullWidth />
                        <TextField label="Issuer" value={formData.issuer || ''} onChange={e => setFormData({ ...formData, issuer: e.target.value })} required fullWidth />
                        <TextField label="Date" type="date" value={formData.date || ''} onChange={e => setFormData({ ...formData, date: e.target.value })} required fullWidth InputLabelProps={{ shrink: true }} />
                        <TextField label="Description" value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} multiline rows={3} fullWidth />
                        <TextField label="Credential URL" value={formData.credential_url || ''} onChange={e => setFormData({ ...formData, credential_url: e.target.value })} fullWidth />
                        <TextField label="Link Text" value={formData.link_text || 'View Credential'} onChange={e => setFormData({ ...formData, link_text: e.target.value })} fullWidth />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={onClose} color="inherit">Cancel</Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? 'Saving...' : 'Save'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}