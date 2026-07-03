import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import ProjectForm from '@/features/projects/components/ProjectForm'
import { projectAPI } from '@/features/projects/api/projectAPI'
import { Project, CreateProjectDTO } from '@/features/projects/types'
import { alert } from '@/utils/confirm'

interface ProjectEditProps {
    mode: 'create' | 'edit'
}

export default function ProjectEdit({ mode }: ProjectEditProps) {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const isCreate = mode === 'create'

    const [loading, setLoading] = useState(!isCreate)
    const [initialData, setInitialData] = useState<Partial<Project> | null>(null)

    useEffect(() => {
        if (isCreate) {
            setInitialData({})
            setLoading(false)
            return
        }

        if (!id) {
            void navigate('/admin/projects')
            return
        }

        const fetchProject = async () => {
            try {
                const data = await projectAPI.getByIdAdmin(parseInt(id, 10))
                if (data) {
                    setInitialData(data)
                } else {
                    throw new Error('Project not found')
                }
            } catch (error: any) {
                console.error("Fetch error:", error)
                if (error.response && error.response.status === 404) {
                    await alert({ title: 'Not Found', text: 'Project with this ID does not exist.', icon: 'warning' })
                } else {
                    await alert({ title: 'Error', text: 'Failed to fetch project data.', icon: 'error' })
                }
                void navigate('/admin/projects', { replace: true })
            } finally {
                setLoading(false)
            }
        }

        void fetchProject()
    }, [id, isCreate, navigate])

    const handleSubmit = async (payload: any) => {
        try {
            if (isCreate) {
                await projectAPI.create(payload as CreateProjectDTO)
            } else if (id) {
                await projectAPI.update(parseInt(id, 10), payload)
            }
            void navigate('/admin/projects')
            await alert({ title: 'Success', text: 'Project saved successfully' })
        } catch (error) {
            console.error(error)
            await alert({ title: 'Error', text: 'Failed to save project', icon: 'error' })
        }
    }

    if (loading) {
        return (
            <Box sx={{ display: 'grid', placeItems: 'center', py: 6, minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        )
    }

    if (!isCreate && !initialData) return null

    return (
        <ProjectForm
            initialData={initialData}
            onSubmit={handleSubmit}
            onCancel={() => { void navigate('/admin/projects') }}
        />
    )
}