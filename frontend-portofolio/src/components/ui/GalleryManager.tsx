import { useState, useEffect } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { fileUrl } from '@/utils/url'

interface GalleryImage {
    id: string
    url: string
}

interface GalleryManagerProps {
    images: GalleryImage[]
    onReorder: (newImages: GalleryImage[]) => void
    onDelete: (id: string) => void
    onEdit: (id: string) => void
    onAdd: () => void
}

interface SortableItemProps {
    id: string
    url: string
    onDelete: (id: string) => void
    onEdit: (id: string) => void
}

function SortableItem({ id, url, onDelete, onEdit }: SortableItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 99 : 'auto',
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative group touch-none">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-all cursor-move shadow-sm">
                <img src={fileUrl(url)} alt="" className="w-full h-full object-cover pointer-events-none" />
            </div>

            <div className="absolute top-1 right-1 flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
                <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        onEdit(id)
                    }}
                    className="p-1.5 rounded-full bg-blue-500 text-white shadow-md hover:bg-blue-600 focus:outline-none"
                    title="Edit image"
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                </button>
                <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        onDelete(id)
                    }}
                    className="p-1.5 rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 focus:outline-none"
                    title="Delete image"
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default function GalleryManager({ images, onReorder, onDelete, onEdit, onAdd }: GalleryManagerProps) {
    const [items, setItems] = useState<GalleryImage[]>(images)

    useEffect(() => {
        setItems(images)
    }, [images])

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id)
            const newIndex = items.findIndex((item) => item.id === over.id)
            const newItems = arrayMove(items, oldIndex, newIndex)
            setItems(newItems)
            onReorder(newItems)
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Images ({items.length})</h3>
                <button type="button" onClick={onAdd} className="px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium transition-colors shadow-sm">
                    + Add Image
                </button>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p className="text-sm text-gray-500 dark:text-gray-400">No images in gallery</p>
                    <button type="button" onClick={onAdd} className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium hover:underline">
                        Upload images
                    </button>
                </div>
            ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={items.map((item) => item.id)} strategy={rectSortingStrategy}>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {items.map((item) => (
                                <SortableItem key={item.id} id={item.id} url={item.url} onDelete={onDelete} onEdit={onEdit} />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}
        </div>
    )
}