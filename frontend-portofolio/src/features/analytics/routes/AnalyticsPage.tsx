import { useEffect, useState } from 'react'
import { Box, Typography, Paper, CircularProgress, Alert, Button } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { format, parseISO, isValid } from 'date-fns'
import { analyticsAPI } from '../api/analyticsAPI'
import { VisitorSummary, VisitorDetail } from '../types'
import VisitorDetailModal from '../components/VisitorDetailModal'

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
    const [visitors, setVisitors] = useState<VisitorSummary[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [selectedDetail, setSelectedDetail] = useState<VisitorDetail | null>(null)
    const [modalOpen, setModalOpen] = useState(false)

    useEffect(() => {
        loadVisitors()
    }, [])

    const loadVisitors = async () => {
        setLoading(true)
        setError('')
        try {
            const data = await analyticsAPI.getSummaries()
            setVisitors(data)
        } catch (err) {
            console.error(err)
            setError('Failed to load analytics data.')
        } finally {
            setLoading(false)
        }
    }

    const handleViewDetails = async (visitorHash: string) => {
        try {
            const data = await analyticsAPI.getDetail(visitorHash)
            setSelectedDetail(data)
            setModalOpen(true)
        } catch (err) {
            console.error(err)
            alert('Failed to load details')
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

    const rows = visitors.map((v) => ({
        id: v.visitorNumber,
        ...v
    }))

    if (loading) {
        return <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 400 }}><CircularProgress /></Box>
    }

    return (
        <Box>
            <Typography variant="h4" fontWeight={800} mb={3}>Visitor Analytics</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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