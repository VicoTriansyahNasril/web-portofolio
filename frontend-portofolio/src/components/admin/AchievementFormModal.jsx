// src/components/admin/AchievementFormModal.jsx
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect } from 'react';

const validationSchema = Yup.object({
    title: Yup.string().required('Judul wajib diisi'),
    issuer: Yup.string().required('Penerbit/Penyelenggara wajib diisi'),
    date: Yup.date().required('Tanggal wajib diisi'),
});

const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().split('T')[0];
};

export default function AchievementFormModal({ open, onClose, onSubmit, initialData = null }) {
    const formik = useFormik({
        initialValues: {
            title: '',
            issuer: '',
            date: '',
            description: '',
            credential_url: '',
            link_text: 'Lihat Kredensial',
        },
        validationSchema,
        onSubmit: (values) => {
            const payload = {
                ...values,
                date: new Date(values.date).toISOString(),
            };
            onSubmit(payload);
        },
    });

    useEffect(() => {
        if (open) {
            formik.resetForm();
            if (initialData) {
                formik.setValues({
                    title: initialData.title || '',
                    issuer: initialData.issuer || '',
                    date: formatDateForInput(initialData.date),
                    description: initialData.description || '',
                    credential_url: initialData.credential_url || '',
                    link_text: initialData.link_text || 'Lihat Kredensial',
                }, false);
            }
        }
    }, [open, initialData]); // eslint-disable-line

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <form onSubmit={formik.handleSubmit}>
                <DialogTitle fontWeight={700}>{initialData ? 'Edit Pencapaian' : 'Tambah Pencapaian'}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ pt: 1 }}>
                        <TextField name="title" label="Judul Pencapaian" {...formik.getFieldProps('title')} error={formik.touched.title && !!formik.errors.title} helperText={formik.touched.title && formik.errors.title} />
                        <TextField name="issuer" label="Penerbit / Penyelenggara" {...formik.getFieldProps('issuer')} error={formik.touched.issuer && !!formik.errors.issuer} helperText={formik.touched.issuer && formik.errors.issuer} />
                        <TextField name="date" label="Tanggal" type="date" InputLabelProps={{ shrink: true }} {...formik.getFieldProps('date')} error={formik.touched.date && !!formik.errors.date} helperText={formik.touched.date && formik.errors.date} />
                        <TextField name="description" label="Deskripsi (opsional)" multiline rows={3} {...formik.getFieldProps('description')} />
                        <TextField name="credential_url" label="Link Kredensial (opsional)" {...formik.getFieldProps('credential_url')} />
                        <TextField
                            select
                            fullWidth
                            name="link_text"
                            label="Jenis Tautan (Teks Tombol)"
                            value={formik.values.link_text}
                            onChange={formik.handleChange}
                            helperText="Pilih jenis tautan yang paling sesuai."
                        >
                            <MenuItem value="Lihat Kredensial">Lihat Kredensial (Untuk verifikasi online)</MenuItem>
                            <MenuItem value="Lihat Sertifikat">Lihat Sertifikat (Untuk file PDF/gambar)</MenuItem>
                            <MenuItem value="Lihat Dokumen">Lihat Dokumen (Untuk lainnya, cth: HKI)</MenuItem>
                        </TextField>
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