import { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import VisitorDetailModal from '../../components/admin/VisitorDetailModal';
import { api } from '../../api/client';
import { format } from 'date-fns';

export default function AdminAnalytics() {
    const [visitors, setVisitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVisitor, setSelectedVisitor] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchVisitors = async () => {
            try {
                const { data } = await api.get('/api/admin/analytics/visitors');
                setVisitors(data);
            } catch (error) {
                console.error("Failed to fetch visitor data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVisitors();
    }, []);

    const handleViewDetails = (visitorHash) => {
        setSelectedVisitor(visitorHash);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedVisitor(null);
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

            {selectedVisitor && (
                <VisitorDetailModal
                    visitorHash={selectedVisitor}
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    visitorNumber={visitors.find(v => v.visitorHash === selectedVisitor)?.visitorNumber}
                />
            )}
        </Box>
    );
}