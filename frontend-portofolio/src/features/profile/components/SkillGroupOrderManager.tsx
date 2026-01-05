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
    onReorder: (newGroups: SkillGroup[]) => void
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
        zIndex: isDragging ? 999 : 'auto',
        touchAction: 'none'
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-grab active:cursor-grabbing hover:border-primary-500 transition-colors shadow-sm select-none"
        >
            <div className="text-gray-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{category}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Pos: {order}</p>
            </div>
        </div>
    )
}

export default function SkillGroupOrderManager({ groups, onReorder }: SkillGroupOrderManagerProps) {
    const [items, setItems] = useState<SkillGroup[]>(groups)

    useEffect(() => {
        setItems(groups);
    }, [groups]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item.category === active.id)
            const newIndex = items.findIndex((item) => item.category === over.id)

            const newItems = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
                ...item,
                order: index + 1,
            }))

            setItems(newItems)
            onReorder(newItems)
        }
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="mb-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Skill Group Order
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Drag to reorder how skill categories appear on public page.
                </p>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-6 text-sm text-gray-500 dark:text-gray-400 italic">
                    No skill groups found. Add skills first.
                </div>
            ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={items.map((item) => item.category)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-2">
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