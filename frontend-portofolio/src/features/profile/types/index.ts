export interface SocialLink {
    id: number
    name: string
    url: string
    icon: string;
    active: boolean
}

export interface Profile {
    id: number
    full_name: string;
    headline: string
    bio: string
    photo_url: string
    location: string
    resume_url: string
    skill_group_order: string
    socials: SocialLink[]
}