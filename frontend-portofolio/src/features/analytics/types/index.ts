export interface VisitorSummary {
    visitorHash: string
    visitorNumber: number
    firstVisit: string
    lastVisit: string
    totalPageViews: number
}

export interface VisitLog {
    id: number
    path: string
    visitor_hash: string
    timestamp: string
}

export interface VisitorDetail {
    visitorHash: string
    firstVisit: string
    lastVisit: string
    totalPageViews: number
    pageFrequencies: { path: string; count: number }[]
    visitLog: VisitLog[]
}