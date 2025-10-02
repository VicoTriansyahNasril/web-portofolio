// src/components/admin/ExperienceFormModal.jsx
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, MenuItem, Grid, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect } from 'react';
import { getYear, getMonth } from 'date-fns';

const validationSchema = Yup.object({
    type: Yup.string().required('Tipe wajib dipilih'),
    title: Yup.string().required('Judul/Posisi wajib diisi'),
    entity_name: Yup.string().required('Nama perusahaan/kampus wajib diisi'),
    start_year: Yup.number().required('Tahun mulai wajib diisi'),
    start_month: Yup.number().required('Bulan mulai wajib diisi'),
});

const MONTHS = [
    { value: 0, label: 'Januari' }, { value: 1, label: 'Februari' }, { value: 2, label: 'Maret' },
    { value: 3, label: 'April' }, { value: 4, label: 'Mei' }, { value: 5, label: 'Juni' },
    { value: 6, label: 'Juli' }, { value: 7, label: 'Agustus' }, { value: 8, label: 'September' },
    { value: 9, label: 'Oktober' }, { value: 10, label: 'November' }, { value: 11, label: 'Desember' },
];

export default function ExperienceFormModal({ open, onClose, onSubmit, initialData = null }) {
    const formik = useFormik({
        initialValues: {
            type: 'Magang', title: '', entity_name: '', location: '',
            description: '', start_month: '', start_year: '',
            end_month: '', end_year: '',
        },
        validationSchema,
        onSubmit: (values) => {
            const startDate = new Date(values.start_year, values.start_month);
            const endDate = (values.end_year && values.end_month !== '') ? new Date(values.end_year, values.end_month) : null;

            const payload = {
                ...values,
                start_date: startDate.toISOString(),
                end_date: endDate ? endDate.toISOString() : null,
            };
            delete payload.start_month;
            delete payload.start_year;
            delete payload.end_month;
            delete payload.end_year;
            onSubmit(payload);
        },
    });

    useEffect(() => {
        if (open) {
            formik.resetForm();
            if (initialData) {
                const startDate = initialData.start_date ? new Date(initialData.start_date) : null;
                const endDate = initialData.end_date ? new Date(initialData.end_date) : null;
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
                }, false);
            }
        }
    }, [open, initialData]); // eslint-disable-line

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <form onSubmit={formik.handleSubmit}>
                <DialogTitle fontWeight={700}>{initialData ? 'Edit Pengalaman' : 'Tambah Pengalaman'}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ pt: 1 }}>
                        <TextField select label="Tipe" name="type" value={formik.values.type} onChange={formik.handleChange}>
                            <MenuItem value="Pekerjaan Penuh Waktu">Pekerjaan Penuh Waktu</MenuItem>
                            <MenuItem value="Magang">Magang</MenuItem>
                            <MenuItem value="Organisasi">Organisasi</MenuItem>
                            <MenuItem value="Pendidikan">Pendidikan</MenuItem>
                        </TextField>
                        <TextField name="title" label="Judul / Posisi" {...formik.getFieldProps('title')} error={formik.touched.title && !!formik.errors.title} helperText={formik.touched.title && formik.errors.title} />
                        <TextField name="entity_name" label="Nama Perusahaan / Kampus / Organisasi" {...formik.getFieldProps('entity_name')} error={formik.touched.entity_name && !!formik.errors.entity_name} helperText={formik.touched.entity_name && formik.errors.entity_name} />
                        <TextField name="location" label="Lokasi (opsional)" {...formik.getFieldProps('location')} />
                        <TextField name="description" label="Deskripsi (opsional)" multiline rows={4} {...formik.getFieldProps('description')} />

                        <Typography variant="subtitle2" color="text.secondary">Tanggal Mulai</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}><TextField select label="Bulan" name="start_month" {...formik.getFieldProps('start_month')} error={formik.touched.start_month && !!formik.errors.start_month}>{MONTHS.map(m => <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>)}</TextField></Grid>
                            <Grid item xs={6}><TextField type="number" label="Tahun" name="start_year" {...formik.getFieldProps('start_year')} error={formik.touched.start_year && !!formik.errors.start_year} /></Grid>
                        </Grid>

                        <Typography variant="subtitle2" color="text.secondary">Tanggal Selesai (kosongkan jika masih berjalan)</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}><TextField select label="Bulan" name="end_month" {...formik.getFieldProps('end_month')}>{MONTHS.map(m => <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>)}</TextField></Grid>
                            <Grid item xs={6}><TextField type="number" label="Tahun" name="end_year" {...formik.getFieldProps('end_year')} /></Grid>
                        </Grid>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Batal</Button>
                    <Button type="submit" variant="contained" disabled={formik.isSubmitting}>Simpan</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}