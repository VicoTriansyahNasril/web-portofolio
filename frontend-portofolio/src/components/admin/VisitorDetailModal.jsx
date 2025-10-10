//src/components/admin/VisitorDetailModal.jsx
import { useState, useEffect } from 'react';
import { Box, Typography, Modal, CircularProgress, List, ListItem, ListItemText, Divider } from '@mui/material';
import { format } from 'date-fns';
import { api } from '../../api/client';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'clamp(300px, 80vw, 800px)',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    maxHeight: '90vh',
    overflowY: 'auto',
};

function SimpleBarChart({ data }) {
    const maxValue = Math.max(...data.map(item => item.count));

    return (
        <Box>
            {data.map((item) => (
                <Box key={item.path} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ width: '120px', flexShrink: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={item.path}>
                        {item.path}
                    </Typography>
                    <Box sx={{ flexGrow: 1, height: '24px', backgroundColor: 'action.hover', borderRadius: 1, overflow: 'hidden' }}>
                        <Box sx={{
                            width: `${(item.count / maxValue) * 100}%`,
                            height: '100%',
                            backgroundColor: 'primary.main',
                            transition: 'width 0.5s ease-in-out'
                        }} />
                    </Box>
                    <Typography variant="body2" sx={{ ml: 2, fontWeight: 'bold' }}>
                        {item.count}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
}

export default function VisitorDetailModal({ visitorHash, visitorNumber, open, onClose }) {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!visitorHash || !open) return;

        const fetchDetails = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/api/admin/analytics/visitors/${visitorHash}`);
                setDetails(data);
            } catch (error) {
                console.error("Failed to fetch visitor details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [visitorHash, open]);

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" component="h2">
                    Details for Visitor #{visitorNumber || ''}
                </Typography>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}><CircularProgress /></Box>
                ) : details ? (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>Most Visited Pages</Typography>
                        <SimpleBarChart data={details.pageFrequencies} />

                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1" gutterBottom>Full Visit Log</Typography>
                        <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
                            {details.visitLog.map((visit, index) => (
                                <ListItem key={index}>
                                    <ListItemText
                                        primary={visit.path}
                                        secondary={format(new Date(visit.timestamp), 'dd MMM yyyy, HH:mm:ss')}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                ) : (
                    <Typography sx={{ mt: 2 }}>Could not load details.</Typography>
                )}
            </Box>
        </Modal>
    );
}