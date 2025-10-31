import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, MenuItem, Typography, Box } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useEffect } from 'react'
import { getYear, getMonth } from 'date-fns'
import { Experience } from '../../types'

interface ExperienceFormModalProps {
    open: boolean
    onClose: () => void
    onSubmit: (data: Partial<Omit<Experience, 'id' | 'created_at' | 'updated_at'>>) => Promise<void>
    initialData?: Experience | null
}

const validationSchema = Yup.object({
    type: Yup.string().required('Tipe wajib dipilih'),
    title: Yup.string().required('Judul/Posisi wajib diisi'),
    entity_name: Yup.string().required('Nama perusahaan/kampus wajib diisi'),
    start_year: Yup.number().required('Tahun mulai wajib diisi'),
    start_month: Yup.number().required('Bulan mulai wajib diisi'),
})

const MONTHS = [
    { value: 0, label: 'Januari' }, { value: 1, label: 'Februari' }, { value: 2, label: 'Maret' },
    { value: 3, label: 'April' }, { value: 4, label: 'Mei' }, { value: 5, label: 'Juni' },
    { value: 6, label: 'Juli' }, { value: 7, label: 'Agustus' }, { value: 8, label: 'September' },
    { value: 9, label: 'Oktober' }, { value: 10, label: 'November' }, { value: 11, label: 'Desember' },
]

interface FormValues {
    type: string; title: string; entity_name: string; location: string; description: string;
    start_month: number | string; start_year: number | string;
    end_month: number | string; end_year: number | string;
}

export default function ExperienceFormModal({ open, onClose, onSubmit, initialData }: ExperienceFormModalProps) {
    const formik = useFormik<FormValues>({
        initialValues: {
            type: 'Magang', title: '', entity_name: '', location: '', description: '',
            start_month: '', start_year: '', end_month: '', end_year: '',
        },
        validationSchema,
        onSubmit: (values) => {
            const startDate = new Date(Number(values.start_year), Number(values.start_month))
            const endDate = (values.end_year && values.end_month !== '')
                ? new Date(Number(values.end_year), Number(values.end_month))
                : null

            const payload: Partial<Omit<Experience, 'id' | 'created_at' | 'updated_at'>> = {
                type: values.type, title: values.title, entity_name: values.entity_name,
                location: values.location, description: values.description,
                start_date: startDate.toISOString(),
                end_date: endDate ? endDate.toISOString() : null,
            }
            onSubmit(payload)
        },
    })

    useEffect(() => {
        if (open) {
            formik.resetForm()
            if (initialData) {
                const startDate = initialData.start_date ? new Date(initialData.start_date) : null
                const endDate = initialData.end_date ? new Date(initialData.end_date) : null
                formik.setValues({
                    type: initialData.type || 'Magang',
                    title: initialData.title || '',
                    entity_name: initialData.entity_name || '',
                    location: initialData.location || '',
                    description: initialData.description || '',
                    start_month: startDate ? getMonth(startDate) : '',
                    start_year: startDate ? getYear(startDate) : '',
                    end_month: endDate ? getMonth(endDate) : '',
                    end_year: endDate ? getYear(endDate) : '',
                }, false)
            }
        }
    }, [open, initialData])

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <form onSubmit={formik.handleSubmit}>
                <DialogTitle fontWeight={700}>
                    {initialData ? 'Edit Pengalaman' : 'Tambah Pengalaman'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ pt: 1 }}>
                        <TextField select label="Tipe" name="type" value={formik.values.type} onChange={formik.handleChange} fullWidth>
                            <MenuItem value="Pekerjaan Penuh Waktu">Pekerjaan Penuh Waktu</MenuItem>
                            <MenuItem value="Magang">Magang</MenuItem>
                            <MenuItem value="Organisasi">Organisasi</MenuItem>
                            <MenuItem value="Pendidikan">Pendidikan</MenuItem>
                        </TextField>

                        <TextField label="Judul / Posisi" name="title" value={formik.values.title} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.title && Boolean(formik.errors.title)} helperText={formik.touched.title && formik.errors.title} fullWidth />
                        <TextField label="Nama Perusahaan / Kampus / Organisasi" name="entity_name" value={formik.values.entity_name} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.entity_name && Boolean(formik.errors.entity_name)} helperText={formik.touched.entity_name && formik.errors.entity_name} fullWidth />
                        <TextField label="Lokasi (opsional)" name="location" value={formik.values.location} onChange={formik.handleChange} fullWidth />
                        <TextField label="Deskripsi (opsional)" name="description" multiline rows={4} value={formik.values.description} onChange={formik.handleChange} fullWidth />

                        <Typography variant="subtitle2" color="text.secondary">Tanggal Mulai</Typography>
                        <Box className="flex space-x-4">
                            <TextField select label="Bulan" name="start_month" value={formik.values.start_month} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.start_month && Boolean(formik.errors.start_month)} fullWidth>
                                {MONTHS.map(m => (<MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>))}
                            </TextField>
                            <TextField type="number" label="Tahun" name="start_year" value={formik.values.start_year} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.start_year && Boolean(formik.errors.start_year)} fullWidth />
                        </Box>

                        <Typography variant="subtitle2" color="text.secondary">Tanggal Selesai (kosongkan jika masih berjalan)</Typography>
                        <Box className="flex space-x-4">
                            <TextField select label="Bulan" name="end_month" value={formik.values.end_month} onChange={formik.handleChange} fullWidth>
                                {MONTHS.map(m => (<MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>))}
                            </TextField>
                            <TextField type="number" label="Tahun" name="end_year" value={formik.values.end_year} onChange={formik.handleChange} fullWidth />
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Batal</Button>
                    <Button type="submit" variant="contained" disabled={formik.isSubmitting}>Simpan</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}