import { useEffect, useState } from 'react';
import { Box, Button, Paper, Typography, CircularProgress, Alert } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { api } from '@/api/client';
import VisitorDetailModal from '@/components/admin/VisitorDetailModal';
import { format, isValid, parseISO } from 'date-fns';
import type { VisitorDetail, VisitorSummary } from '@/types';

const formatDate = (dateString: string): string => {
    try {
        const date = parseISO(dateString);
        if (!isValid(date)) return 'Invalid date';
        return format(date, 'dd MMM yyyy, HH:mm');
    } catch {
        return 'Invalid date';
    }
};

export default function AdminAnalytics() {
    const [visitors, setVisitors] = useState<VisitorSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedDetail, setSelectedDetail] = useState<VisitorDetail | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        loadVisitors();
    }, []);

    const loadVisitors = async () => {
        setLoading(true);
        setError('');
        try {
            const { data } = await api.get<VisitorSummary[]>('/api/admin/analytics/visitors');
            setVisitors(Array.isArray(data) ? data : []);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Gagal memuat data pengunjung';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (visitorHash: string) => {
        if (!visitorHash) {
            setError('Visitor hash tidak valid.');
            return;
        }
        try {
            const { data } = await api.get<VisitorDetail>(`/api/admin/analytics/visitors/${visitorHash}`);
            setSelectedDetail(data);
            setModalOpen(true);
        } catch (err) {
            console.error('Failed to fetch visitor details:', err);
            setError('Gagal memuat detail pengunjung');
        }
    };

    const columns: GridColDef[] = [
        {
            field: 'visitorNumber',
            headerName: 'Visitor ID',
            width: 150,
            renderCell: (params) => `Visitor #${params.value}`,
        },
        {
            field: 'totalPageViews',
            headerName: 'Total Page Views',
            width: 180,
            type: 'number',
        },
        {
            field: 'firstVisit',
            headerName: 'First Visit',
            width: 200,
            valueFormatter: (value: string) => formatDate(value),
        },
        {
            field: 'lastVisit',
            headerName: 'Last Visit',
            width: 200,
            valueFormatter: (value: string) => formatDate(value),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false,
            renderCell: (params: GridRenderCellParams<any, VisitorSummary>) => (
                <Button
                    size="small"
                    onClick={() => handleViewDetails(params.row.visitorHash)}
                >
                    View Details
                </Button>
            ),
        },
    ];

    const rows = visitors.map((v) => ({
        id: v.visitorNumber,
        ...v
    }));

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" fontWeight={700} mb={3}>
                Visitor Analytics
            </Typography>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}
            <Paper>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[10, 25, 50]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    sx={{ minHeight: 400 }}
                    autoHeight
                    disableRowSelectionOnClick
                />
            </Paper>
            {selectedDetail && (
                <VisitorDetailModal
                    detail={selectedDetail}
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </Box>
    );
}