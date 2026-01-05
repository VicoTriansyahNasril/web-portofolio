export interface Experience {
    id: number
    type: string
    title: string
    entity_name: string
    location: string
    description: string
    start_date: string
    end_date: string | null
    sort_order: number
    created_at: string
    updated_at: string
}

export type ExperienceDTO = Omit<Experience, 'id' | 'created_at' | 'updated_at'>