import { useState, useEffect, FormEvent } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack } from '@mui/material'
import { Skill } from '../types'

interface SkillFormModalProps {
    open: boolean
    onClose: () => void
    onSubmit: (data: Partial<Skill>) => Promise<void>
    initialData?: Skill | null
}

export default function SkillFormModal({ open, onClose, onSubmit, initialData }: SkillFormModalProps) {
    const [name, setName] = useState('')
    const [group, setGroup] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (open) {
            setName(initialData?.name || '')
            setGroup(initialData?.group || '')
        }
    }, [initialData, open])

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!name || !group) return

        setLoading(true)
        try {
            await onSubmit({ name, group })
            onClose()
        } finally {
            setLoading(false)
        }
    }

    if (!open) return null

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <form onSubmit={handleSubmit}>
                <DialogTitle fontWeight={700}>
                    {initialData ? 'Edit Skill' : 'Add Skill'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            label="Skill Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            fullWidth
                            placeholder="e.g. React"
                        />
                        <TextField
                            label="Group"
                            value={group}
                            onChange={(e) => setGroup(e.target.value)}
                            required
                            fullWidth
                            placeholder="e.g. Frontend"
                        />
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