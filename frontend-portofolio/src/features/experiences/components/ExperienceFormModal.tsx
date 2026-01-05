import { useState, useEffect, FormEvent } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, MenuItem, Box, Typography } from '@mui/material'
import { Experience, ExperienceDTO } from '../types'

interface ExperienceFormModalProps {
    open: boolean
    onClose: () => void
    onSubmit: (data: Partial<Experience>) => Promise<void>
    initialData?: Experience | null
}

const MONTHS = Array.from({ length: 12 }, (_, i) => ({ value: i, label: new Date(0, i).toLocaleString('default', { month: 'long' }) }))

export default function ExperienceFormModal({ open, onClose, onSubmit, initialData }: ExperienceFormModalProps) {
    const [formData, setFormData] = useState<any>({
        type: 'Magang', title: '', entity_name: '', location: '', description: '',
        start_month: 0, start_year: new Date().getFullYear(),
        end_month: 0, end_year: ''
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (open && initialData) {
            const start = new Date(initialData.start_date)
            const end = initialData.end_date ? new Date(initialData.end_date) : null
            setFormData({
                type: initialData.type,
                title: initialData.title,
                entity_name: initialData.entity_name,
                location: initialData.location,
                description: initialData.description,
                start_month: start.getMonth(),
                start_year: start.getFullYear(),
                end_month: end ? end.getMonth() : 0,
                end_year: end ? end.getFullYear() : ''
            })
        } else if (open) {
            setFormData({
                type: 'Magang', title: '', entity_name: '', location: '', description: '',
                start_month: 0, start_year: new Date().getFullYear(),
                end_month: 0, end_year: ''
            })
        }
    }, [initialData, open])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const startDate = new Date(Number(formData.start_year), Number(formData.start_month))
        const endDate = formData.end_year ? new Date(Number(formData.end_year), Number(formData.end_month)) : null

        const payload: Partial<ExperienceDTO> = {
            type: formData.type,
            title: formData.title,
            entity_name: formData.entity_name,
            location: formData.location,
            description: formData.description,
            start_date: startDate.toISOString(),
            end_date: endDate ? endDate.toISOString() : null
        }

        try {
            await onSubmit(payload)
            onClose()
        } finally {
            setLoading(false)
        }
    }

    if (!open) return null

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <form onSubmit={handleSubmit}>
                <DialogTitle fontWeight={700}>{initialData ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} pt={1}>
                        <TextField select label="Type" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} fullWidth>
                            {['Pekerjaan Penuh Waktu', 'Magang', 'Organisasi', 'Pendidikan'].map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                        </TextField>
                        <TextField label="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required fullWidth />
                        <TextField label="Company/Org" value={formData.entity_name} onChange={e => setFormData({ ...formData, entity_name: e.target.value })} required fullWidth />
                        <TextField label="Location" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} fullWidth />
                        <TextField label="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} multiline rows={4} fullWidth />

                        <Typography variant="subtitle2">Start Date</Typography>
                        <Box className="flex gap-2">
                            <TextField select label="Month" value={formData.start_month} onChange={e => setFormData({ ...formData, start_month: e.target.value })} fullWidth>
                                {MONTHS.map(m => <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>)}
                            </TextField>
                            <TextField label="Year" type="number" value={formData.start_year} onChange={e => setFormData({ ...formData, start_year: e.target.value })} fullWidth />
                        </Box>

                        <Typography variant="subtitle2">End Date (Empty if current)</Typography>
                        <Box className="flex gap-2">
                            <TextField select label="Month" value={formData.end_month} onChange={e => setFormData({ ...formData, end_month: e.target.value })} fullWidth>
                                {MONTHS.map(m => <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>)}
                            </TextField>
                            <TextField label="Year" type="number" value={formData.end_year} onChange={e => setFormData({ ...formData, end_year: e.target.value })} fullWidth />
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}