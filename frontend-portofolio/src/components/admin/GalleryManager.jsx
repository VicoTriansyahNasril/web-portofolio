//src/components/admin/GalleryManager.jsx
import { Box, IconButton, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useMemo, useRef, useState } from 'react';
import { fileUrl } from '../../utils/url';

export default function GalleryManager({ items = [], onChange }) {
    const [list, setList] = useState(items);
    const [dragIdx, setDragIdx] = useState(null);
    const [overIdx, setOverIdx] = useState(null);
    const dragIndexRef = useRef(null);

    useMemo(() => {
        if (JSON.stringify(items) !== JSON.stringify(list)) setList(items);
    }, [items]); // eslint-disable-line

    const commit = (arr) => {
        setList(arr);
        onChange?.(arr);
    };

    const onDragStart = (e, idx) => {
        dragIndexRef.current = idx;
        setDragIdx(idx);
        const ghost = document.createElement('div');
        ghost.style.width = '0px';
        ghost.style.height = '0px';
        document.body.appendChild(ghost);
        e.dataTransfer.setDragImage(ghost, 0, 0);
        setTimeout(() => document.body.removeChild(ghost), 0);
        e.dataTransfer.effectAllowed = 'move';
    };

    const onDragOver = (e, idx) => {
        e.preventDefault();
        setOverIdx(idx);
    };

    const onDrop = (e, idx) => {
        e.preventDefault();
        const from = dragIndexRef.current;
        const to = idx;
        setOverIdx(null);
        setDragIdx(null);
        dragIndexRef.current = null;
        if (from === null || to === null || from === to) return;
        const arr = [...list];
        const [moved] = arr.splice(from, 1);
        arr.splice(to, 0, moved);
        commit(arr);
    };

    const onDragEnd = () => { setOverIdx(null); setDragIdx(null); dragIndexRef.current = null };

    const removeAt = (idx) => {
        const arr = list.filter((_, i) => i !== idx);
        commit(arr);
    };

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px,1fr))',
                gap: 1,
                '& > .gm-item': { transition: 'transform .18s ease, box-shadow .18s ease' },
                '& > .gm-item.dragging': { transform: 'scale(1.05) rotate(1deg)', boxShadow: 6, zIndex: 1 },
                '& > .gm-item.over': { transform: 'translateY(-4px)', boxShadow: 4 },
            }}
        >
            {list.map((src, i) => (
                <Box
                    key={src + i}
                    className={`gm-item${dragIdx === i ? ' dragging' : ''}${overIdx === i ? ' over' : ''}`}
                    draggable
                    onDragStart={(e) => onDragStart(e, i)}
                    onDragOver={(e) => onDragOver(e, i)}
                    onDrop={(e) => onDrop(e, i)}
                    onDragEnd={onDragEnd}
                    sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        overflow: 'hidden',
                        position: 'relative',
                        userSelect: 'none',
                        cursor: 'grab',
                        bgcolor: 'background.paper',
                    }}
                >
                    <img src={fileUrl(src)} alt={`g-${i}`} style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }} />

                    <Stack direction="row" spacing={0.5} sx={{ position: 'absolute', top: 6, left: 6 }}>
                        <IconButton size="small" sx={{ bgcolor: 'rgba(0,0,0,.45)', color: 'white' }} disableRipple>
                            <DragIndicatorIcon fontSize="small" />
                        </IconButton>
                    </Stack>
                    <IconButton
                        size="small"
                        onClick={() => removeAt(i)}
                        sx={{ position: 'absolute', top: 6, right: 6, bgcolor: 'rgba(0,0,0,.45)', color: 'white' }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            ))}
        </Box>
    );
}