import { useState, useEffect } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export interface SkillGroup {
    category: string
    order: number
}

interface SkillGroupOrderManagerProps {
    groups: SkillGroup[]
    onReorder: (newGroups: SkillGroup[]) => Promise<void>
}

interface SortableGroupItemProps {
    category: string
    order: number
}

function SortableGroupItem({ category, order }: SortableGroupItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: category })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-move hover:border-primary-500 transition-colors"
        >
            <div className="flex items-center gap-3 flex-1">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{category}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Order: {order}</p>
                </div>
            </div>
        </div>
    )
}

export default function SkillGroupOrderManager({ groups, onReorder }: SkillGroupOrderManagerProps) {
    const [items, setItems] = useState<SkillGroup[]>(groups)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setItems(groups);
    }, [groups]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item.category === active.id)
            const newIndex = items.findIndex((item) => item.category === over.id)

            const newItems = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
                ...item,
                order: index + 1,
            }))

            setItems(newItems)
            setLoading(true)
            try {
                await onReorder(newItems)
            } catch (error) {
                console.error('Error reordering groups:', error)
                setItems(items) // Revert on error
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Skill Group Order
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Drag and drop to reorder skill categories on the public page.
                </p>
            </div>

            {loading && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm">
                    Saving new order...
                </div>
            )}

            {items.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No skill groups found. Add skills with groups to see them here.
                </div>
            ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={items.map((item) => item.category)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-3">
                            {items.map((item) => (
                                <SortableGroupItem key={item.category} category={item.category} order={item.order} />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}
        </div>
    )
}