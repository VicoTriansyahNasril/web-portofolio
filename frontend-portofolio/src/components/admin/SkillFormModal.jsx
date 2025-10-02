// src/components/admin/SkillFormModal.jsx
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack
} from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useEffect } from 'react'

const validationSchema = Yup.object({
    name: Yup.string().required('Nama skill wajib diisi'),
    group: Yup.string().required('Grup wajib diisi (cth: Frontend, Backend, Tools)'),
})

export default function SkillFormModal({ open, onClose, onSubmit, initialData = null }) {
    const formik = useFormik({
        initialValues: {
            name: '',
            group: '',
        },
        validationSchema,
        onSubmit: (values, { setSubmitting }) => {
            onSubmit(values)
            setSubmitting(false)
        },
    })

    useEffect(() => {
        if (open) {
            formik.resetForm()
            if (initialData) {
                formik.setValues({
                    name: initialData.name || '',
                    group: initialData.group || '',
                }, false)
            }
        }
    }, [open, initialData]) // eslint-disable-line

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <form onSubmit={formik.handleSubmit}>
                <DialogTitle fontWeight={700}>
                    {initialData ? 'Edit Skill' : 'Tambah Skill Baru'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ pt: 1 }}>
                        <TextField
                            name="name"
                            label="Nama Skill"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                        <TextField
                            name="group"
                            label="Grup"
                            value={formik.values.group}
                            onChange={formik.handleChange}
                            error={formik.touched.group && Boolean(formik.errors.group)}
                            helperText={formik.touched.group && formik.errors.group}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Batal</Button>
                    <Button type="submit" variant="contained" disabled={formik.isSubmitting}>
                        Simpan
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}