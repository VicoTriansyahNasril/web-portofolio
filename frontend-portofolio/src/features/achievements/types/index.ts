export interface Achievement {
    id: number
    title: string
    issuer: string
    date: string
    description: string
    credential_url: string
    link_text: string
    sort_order: number
    created_at: string
    updated_at: string
}

export type AchievementDTO = Omit<Achievement, 'id' | 'created_at' | 'updated_at' | 'sort_order'>