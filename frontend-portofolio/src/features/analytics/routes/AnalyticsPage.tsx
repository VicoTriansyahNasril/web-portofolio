import { useState } from 'react'
import { Box, Typography, Paper, CircularProgress, Alert, Button, Stack, Chip } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { format, parseISO, isValid } from 'date-fns'
import useSWR from 'swr'
import CircleIcon from '@mui/icons-material/Circle'
import { analyticsAPI } from '../api/analyticsAPI'
import { VisitorSummary, VisitorDetail } from '../types'
import VisitorDetailModal from '../components/VisitorDetailModal'
import { useActiveVisitors } from '@/hooks/useActiveVisitors'

const formatDate = (dateString: string): string => {
    try {
        const date = parseISO(dateString)
        if (!isValid(date)) return 'Invalid date'
        return format(date, 'dd MMM yyyy, HH:mm')
    } catch {
        return 'Invalid date'
    }
}

export default function AnalyticsPage() {
    const { data: visitors, error, isLoading } = useSWR<VisitorSummary[]>(
        '/api/admin/analytics/visitors',
        analyticsAPI.getSummaries,
        {
            dedupingInterval: 0,
            revalidateOnFocus: false
        }
    )
    const activeVisitors = useActiveVisitors()

    const [selectedDetail, setSelectedDetail] = useState<VisitorDetail | null>(null)
    const [modalOpen, setModalOpen] = useState(false)

    const handleViewDetails = async (visitorHash: string) => {
        try {
            const data = await analyticsAPI.getDetail(visitorHash)
            setSelectedDetail(data)
            setModalOpen(true)
        } catch (err) {
            console.error(err)
        }
    }

    const columns: GridColDef[] = [
        {
            field: 'visitorNumber',
            headerName: 'Visitor ID',
            width: 120,
            renderCell: (params) => `Visitor #${params.value}`,
        },
        {
            field: 'totalPageViews',
            headerName: 'Views',
            width: 100,
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
                <Button size="small" onClick={() => handleViewDetails(params.row.visitorHash)}>
                    View Details
                </Button>
            ),
        },
    ]

    const rows = visitors?.map((v) => ({
        id: v.visitorNumber,
        ...v
    })) || []

    if (isLoading) {
        return <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 400 }}><CircularProgress /></Box>
    }

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight={800}>Visitor Analytics</Typography>
                <Chip
                    icon={<CircleIcon sx={{ color: '#10B981 !important', fontSize: '12px !important' }} />}
                    label={`${activeVisitors} Active Now`}
                    sx={{
                        fontWeight: 700,
                        bgcolor: 'rgba(16, 185, 129, 0.1)',
                        color: '#10B981',
                        border: '1px solid rgba(16, 185, 129, 0.2)'
                    }}
                />
            </Stack>

            {error && <Alert severity="error" sx={{ mb: 2 }}>Failed to load analytics data.</Alert>}

            <Paper sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
                    pageSizeOptions={[10, 25, 50]}
                    disableRowSelectionOnClick
                />
            </Paper>

            <VisitorDetailModal
                detail={selectedDetail}
                open={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </Box>
    )
}