//src/pages/admin/ProjectEdit.jsx
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createProject, getProjectAdminById, updateProject } from '../../api/projects'
import ProjectForm from '../../components/admin/ProjectForm'
import { Box, CircularProgress } from '@mui/material'

export default function ProjectEdit({ mode }) {
    const { id } = useParams()
    const nav = useNavigate()
    const isCreate = useMemo(() => mode === 'create', [mode])

    const [loading, setLoading] = useState(!isCreate)
    const [initial, setInitial] = useState(null)

    useEffect(() => {
        if (isCreate) return
        let ok = true
            ; (async () => {
                try {
                    const data = await getProjectAdminById(id)
                    if (ok) { setInitial(data); setLoading(false) }
                } catch {
                    if (ok) setLoading(false)
                }
            })()
        return () => { ok = false }
    }, [id, isCreate])

    const handleSubmit = async (payload) => {
        if (isCreate) {
            await createProject(payload)
        } else {
            await updateProject(id, payload)
        }
        nav('/admin/projects', { replace: true })
    }

    if (!isCreate && loading) {
        return (
            <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <ProjectForm
            initial={isCreate ? {} : (initial || {})}
            onSubmit={handleSubmit}
            onCancel={() => nav('/admin/projects')}
        />
    )
}
