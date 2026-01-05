import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Divider, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper } from '@mui/material'
import { format, parseISO, isValid } from 'date-fns'
import { VisitorDetail } from '../types'

interface VisitorDetailModalProps {
    detail: VisitorDetail | null
    open: boolean
    onClose: () => void
}

const formatDate = (dateString: string): string => {
    try {
        const date = parseISO(dateString)
        if (!isValid(date)) return 'Invalid date'
        return format(date, 'dd MMM yyyy, HH:mm:ss')
    } catch {
        return 'Invalid date'
    }
}

export default function VisitorDetailModal({ detail, open, onClose }: VisitorDetailModalProps) {
    if (!detail) return null

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontWeight: 700 }}>Visitor Details</DialogTitle>
            <DialogContent dividers>
                <Box sx={{ mb: 4, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                    <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">Total Visits</Typography>
                        <Typography variant="h5" color="primary.main" fontWeight={700}>{detail.totalPageViews}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">Most Visited</Typography>
                        <Typography variant="h6">{detail.pageFrequencies[0]?.path || 'N/A'}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">First Visit</Typography>
                        <Typography variant="body1">{formatDate(detail.firstVisit)}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">Last Visit</Typography>
                        <Typography variant="body1">{formatDate(detail.lastVisit)}</Typography>
                    </Box>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Typography variant="h6" fontWeight={700} gutterBottom>Visit Log</Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 300 }}>
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600 }}>Path</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Time</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {detail.visitLog.map((log) => (
                                <TableRow key={log.id} hover>
                                    <TableCell sx={{ fontFamily: 'monospace' }}>{log.path}</TableCell>
                                    <TableCell>{formatDate(log.timestamp)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained">Close</Button>
            </DialogActions>
        </Dialog>
    )
}