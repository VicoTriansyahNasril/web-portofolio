import { ReactNode } from 'react';
import { Box, Paper, Stack, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableItemProps<T> {
    item: T;
    id: string | number;
    renderItem: (item: T) => ReactNode;
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    customActions?: (item: T) => ReactNode;
}

function SortableItem<T>({ item, id, renderItem, onEdit, onDelete, customActions }: SortableItemProps<T>) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
        <Paper ref={setNodeRef} style={style} sx={{ p: 2, display: 'flex', alignItems: 'center', touchAction: 'none' }}>
            <Box {...attributes} {...listeners} sx={{ cursor: 'grab', color: 'text.secondary', mr: 1.5, '&:active': { cursor: 'grabbing' }, display: 'flex', alignItems: 'center' }}>
                <DragIndicatorIcon />
            </Box>
            <Box sx={{ flex: 1 }}>
                {renderItem(item)}
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
                {customActions && customActions(item)}
                {onEdit && <IconButton onClick={() => onEdit(item)} color="primary"><EditIcon /></IconButton>}
                {onDelete && <IconButton onClick={() => onDelete(item)} color="error"><DeleteIcon /></IconButton>}
            </Stack>
        </Paper>
    );
}

interface SortableListProps<T> {
    items: T[];
    getId: (item: T) => string | number;
    onReorder: (newOrder: T[]) => Promise<void>;
    renderItem: (item: T) => ReactNode;
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    customActions?: (item: T) => ReactNode;
}

export default function SortableList<T>({ items, getId, onReorder, renderItem, onEdit, onDelete, customActions }: SortableListProps<T>) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex(item => getId(item) === active.id);
            const newIndex = items.findIndex(item => getId(item) === over.id);
            const newOrder = arrayMove(items, oldIndex, newIndex);
            await onReorder(newOrder);
        }
    };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map(getId)} strategy={verticalListSortingStrategy}>
                <Stack spacing={2}>
                    {items.map(item => (
                        <SortableItem 
                            key={getId(item)} 
                            id={getId(item)} 
                            item={item} 
                            renderItem={renderItem} 
                            onEdit={onEdit} 
                            onDelete={onDelete} 
                            customActions={customActions}
                        />
                    ))}
                </Stack>
            </SortableContext>
        </DndContext>
    );
}
