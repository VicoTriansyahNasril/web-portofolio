export interface Project {
    id: number
    slug: string
    title: string
    summary: string
    body: string
    cover_url: string
    repo_url: string
    demo_url: string
    tech_stack: string
    gallery: string[]
    role: string
    status: 'draft' | 'published'
    is_featured: boolean
    sort_order?: number
    start_date?: string | null
    end_date?: string | null
    created_at: string
    updated_at: string
}

export type CreateProjectDTO = Omit<Project, 'id' | 'created_at' | 'updated_at'>
export type UpdateProjectDTO = Partial<CreateProjectDTO>