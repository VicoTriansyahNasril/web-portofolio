//src/components/admin/GalleryManager.jsx
import { Box, IconButton, Stack, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CropIcon from '@mui/icons-material/Crop';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useMemo, useRef, useState } from 'react';
import { fileUrl } from '../../utils/url';

export default function GalleryManager({ items = [], onChange, onCrop }) {
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
        e.dataTransfer.effectAllowed = 'move';
        const ghost = document.createElement('div');
        ghost.style.width = '0px';
        ghost.style.height = '0px';
        document.body.appendChild(ghost);
        e.dataTransfer.setDragImage(ghost, 0, 0);
        setTimeout(() => document.body.removeChild(ghost), 0);
    };

    const onDragOver = (e) => e.preventDefault();
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
    const onDragEnd = () => { setOverIdx(null); setDragIdx(null); dragIndexRef.current = null; };
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
            }}
        >
            {list.map((src, i) => (
                <Box
                    key={src + i}
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
                        bgcolor: 'background.paper',
                        transition: 'transform .18s ease, box-shadow .18s ease',
                        transform: dragIdx === i ? 'scale(1.05) rotate(1deg)' : (overIdx === i ? 'translateY(-4px)' : 'none'),
                        boxShadow: dragIdx === i ? 6 : (overIdx === i ? 4 : 'none'),
                        zIndex: dragIdx === i ? 1 : 'auto',
                        cursor: 'grab',
                    }}
                >
                    <img src={fileUrl(src)} alt={`g-${i}`} style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }} />

                    <Box sx={{ position: 'absolute', top: 4, left: 4 }}>
                        <IconButton size="small" sx={{ bgcolor: 'rgba(0,0,0,.45)', color: 'white', cursor: 'grab' }} disableRipple>
                            <DragIndicatorIcon fontSize="small" />
                        </IconButton>
                    </Box>
                    <Stack direction="row" spacing={0.5} sx={{ position: 'absolute', top: 4, right: 4 }}>
                        <Tooltip title="Crop Gambar">
                            <IconButton size="small" sx={{ bgcolor: 'rgba(0,0,0,.45)', color: 'white' }} onClick={() => onCrop?.(i)}>
                                <CropIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Hapus Gambar">
                            <IconButton size="small" sx={{ bgcolor: 'rgba(0,0,0,.45)', color: 'white' }} onClick={() => removeAt(i)}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Box>
            ))}
        </Box>
    );
}