import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createAdminProject, fetchAdminProjectById, updateAdminProject } from '../../api/projects'
import ProjectForm from '../../components/admin/ProjectForm'
import { Box, CircularProgress } from '@mui/material'
import { Project } from '../../types'

type Props = {
    mode: 'create' | 'edit'
}

export default function ProjectEdit({ mode }: Props) {
    const { id } = useParams<{ id: string }>();
    const nav = useNavigate();
    const isCreate = useMemo(() => mode === 'create', [mode]);

    const [loading, setLoading] = useState<boolean>(!isCreate);
    const [initialData, setInitialData] = useState<Partial<Project> | null>(null);

    useEffect(() => {
        if (isCreate || !id) {
            setLoading(false);
            setInitialData({});
            return;
        }

        let ok = true;
        (async () => {
            try {
                const data = await fetchAdminProjectById(parseInt(id, 10));
                if (ok) {
                    setInitialData(data);
                }
            } catch {
                if (ok) console.error("Failed to fetch project for editing");
            } finally {
                if (ok) setLoading(false);
            }
        })();

        return () => {
            ok = false;
        };
    }, [id, isCreate]);

    const handleSubmit = async (payload: Partial<Project>) => {
        try {
            if (isCreate) {
                await createAdminProject(payload);
            } else if (id) {
                await updateAdminProject(parseInt(id, 10), payload);
            }
            nav('/admin/projects', { replace: true });
        } catch (error) {
            console.error("Failed to save project", error);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <ProjectForm
            initialData={initialData || {}}
            onSubmit={handleSubmit}
            onCancel={() => nav('/admin/projects')}
        />
    );
}