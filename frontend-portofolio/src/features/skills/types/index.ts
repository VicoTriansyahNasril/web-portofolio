export interface Skill {
    id: number
    name: string
    group: string
    sort_order: number
    created_at: string
    updated_at: string
}

export type SkillCreateDTO = Pick<Skill, 'name' | 'group'>