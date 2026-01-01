export interface Social {
    id: number;
    name: string;
    url: string;
    icon: string;
    active: boolean;
}

export interface Profile {
    id: number;
    full_name: string;
    headline: string;
    bio: string;
    photo_url: string;
    location: string;
    resume_url: string;
    skill_group_order: string;
    socials: Social[];
}

export interface Project {
    id: number;
    slug: string;
    title: string;
    summary: string;
    body: string;
    cover_url: string;
    repo_url: string;
    demo_url: string;
    tech_stack: string;
    gallery: string[];
    role: string;
    status: 'draft' | 'published';
    is_featured: boolean;
    sort_order?: number;
    start_date?: string | null;
    end_date?: string | null;
    created_at: string;
    updated_at: string;
}

export interface Skill {
    id: number;
    name: string;
    group: string;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface Experience {
    id: number;
    type: string;
    title: string;
    entity_name: string;
    location: string;
    description: string;
    start_date: string;
    end_date: string | null;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface Achievement {
    id: number;
    title: string;
    issuer: string;
    date: string;
    description: string;
    credential_url: string;
    link_text: string;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface VisitorSummary {
    visitorHash: string;
    visitorNumber: number;
    firstVisit: string;
    lastVisit: string;
    totalPageViews: number;
}

export interface VisitorDetail {
    visitorHash: string;
    firstVisit: string;
    lastVisit: string;
    totalPageViews: number;
    pageFrequencies: { path: string; count: number }[];
    visitLog: { id: number; path: string; visitor_hash: string; timestamp: string }[];
}

export interface SweetAlertOptions {
    title?: string;
    text?: string;
    icon?: 'success' | 'error' | 'warning' | 'info' | 'question';
    confirmText?: string;
    cancelText?: string;
}