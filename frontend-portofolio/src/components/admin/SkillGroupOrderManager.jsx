// src/components/admin/SkillGroupOrderManager.jsx
import { useState, useRef, useEffect } from 'react';
import { Box, Paper, Stack, Typography } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

export default function SkillGroupOrderManager({ availableGroups = [], currentOrder = [], onOrderChange }) {
    const [orderedGroups, setOrderedGroups] = useState([]);
    const [dragIdx, setDragIdx] = useState(null);
    const dragIndexRef = useRef(null);

    useEffect(() => {
        const current = Array.isArray(currentOrder) ? currentOrder : [];
        const existing = current.filter(group => availableGroups.includes(group));
        const newGroups = availableGroups.filter(group => !existing.includes(group));
        const finalOrder = [...existing, ...newGroups];
        setOrderedGroups(finalOrder);
    }, [availableGroups, currentOrder]);

    const handleDragStart = (e, index) => {
        dragIndexRef.current = index;
        setDragIdx(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', null);
    };

    const handleDragOver = (e) => e.preventDefault();

    const handleDrop = (e, toIndex) => {
        e.preventDefault();
        const fromIndex = dragIndexRef.current;
        setDragIdx(null);
        dragIndexRef.current = null;
        if (fromIndex === null || fromIndex === toIndex) return;

        const nextOrder = [...orderedGroups];
        const [movedItem] = nextOrder.splice(fromIndex, 1);
        nextOrder.splice(toIndex, 0, movedItem);
        setOrderedGroups(nextOrder);
        onOrderChange(nextOrder);
    };

    return (
        <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={600}>Urutan Grup Keahlian</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: -1 }}>
                Seret untuk mengubah urutan tampilan di halaman publik.
            </Typography>
            <Stack spacing={1}>
                {orderedGroups.map((group, i) => (
                    <Paper
                        key={group}
                        draggable
                        onDragStart={(e) => handleDragStart(e, i)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, i)}
                        sx={{
                            p: 1.5, display: 'flex', alignItems: 'center', gap: 1, cursor: 'grab',
                            opacity: dragIdx === i ? 0.5 : 1,
                            border: '1px solid', borderColor: 'divider',
                        }}
                    >
                        <DragIndicatorIcon sx={{ color: 'text.secondary' }} />
                        <Typography>{group}</Typography>
                    </Paper>
                ))}
            </Stack>
        </Stack>
    );
}