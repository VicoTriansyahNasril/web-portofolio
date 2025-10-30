import { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import VisitorDetailModal from '../../components/admin/VisitorDetailModal';
import { api } from '../../api/client';
import { format } from 'date-fns';
import { VisitorSummary, VisitorDetail } from '../../types';

export default function AdminAnalytics() {
    const [visitors, setVisitors] = useState<VisitorSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVisitorDetail, setSelectedVisitorDetail] = useState<VisitorDetail | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchVisitors = async () => {
            try {
                const { data } = await api.get<VisitorSummary[]>('/api/admin/analytics/visitors');
                setVisitors(data);
            } catch (error) {
                console.error("Failed to fetch visitor data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVisitors();
    }, []);

    const handleViewDetails = async (visitorHash: string) => {
        try {
            const { data } = await api.get<VisitorDetail>(`/api/admin/analytics/visitors/${visitorHash}`);
            setSelectedVisitorDetail(data);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Failed to fetch visitor details:", error);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedVisitorDetail(null);
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Visitor Analytics</Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Visitor ID</TableCell>
                            <TableCell align="right">Total Page Views</TableCell>
                            <TableCell align="right">First Visit</TableCell>
                            <TableCell align="right">Last Visit</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {visitors.map((visitor) => (
                            <TableRow key={visitor.visitorHash}>
                                <TableCell component="th" scope="row">
                                    Visitor #{visitor.visitorNumber}
                                </TableCell>
                                <TableCell align="right">{visitor.totalPageViews}</TableCell>
                                <TableCell align="right">{format(new Date(visitor.firstVisit), 'dd MMM yyyy, HH:mm')}</TableCell>
                                <TableCell align="right">{format(new Date(visitor.lastVisit), 'dd MMM yyyy, HH:mm')}</TableCell>
                                <TableCell align="right">
                                    <Button variant="outlined" size="small" onClick={() => handleViewDetails(visitor.visitorHash)}>
                                        View Details
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <VisitorDetailModal
                detail={selectedVisitorDetail}
                open={isModalOpen}
                onClose={handleCloseModal}
            />
        </Box>
    );
}