package dto

// --- Auth ---
type LoginReq struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// --- Projects ---
type CreateProjectReq struct {
	Slug       string   `json:"slug" binding:"required"`
	Title      string   `json:"title" binding:"required"`
	Summary    string   `json:"summary" binding:"required"`
	Body       string   `json:"body"`
	CoverURL   string   `json:"cover_url"`
	RepoURL    string   `json:"repo_url"`
	DemoURL    string   `json:"demo_url"`
	Role       string   `json:"role"`
	Status     string   `json:"status"`
	IsFeatured bool     `json:"is_featured"`
	Gallery    []string `json:"gallery"`
	TechStack  string   `json:"tech_stack"`
	StartDate  string   `json:"start_date"`
	EndDate    string   `json:"end_date"`
}

type UpdateProjectReq struct {
	Slug       *string   `json:"slug"`
	Title      *string   `json:"title"`
	Summary    *string   `json:"summary"`
	Body       *string   `json:"body"`
	CoverURL   *string   `json:"cover_url"`
	RepoURL    *string   `json:"repo_url"`
	DemoURL    *string   `json:"demo_url"`
	Role       *string   `json:"role"`
	Status     *string   `json:"status"`
	IsFeatured *bool     `json:"is_featured"`
	Gallery    *[]string `json:"gallery"`
	SortOrder  *int      `json:"sort_order"`
	TechStack  *string   `json:"tech_stack"`
	StartDate  *string   `json:"start_date"`
	EndDate    *string   `json:"end_date"`
}

// --- Common Reorder ---
type ReorderItem struct {
	ID        uint `json:"id"`
	SortOrder int  `json:"sort_order"`
}

type ReorderReq struct {
	Orders []ReorderItem `json:"orders" binding:"required"`
}

// --- Skills ---
type SkillReq struct {
	Group string `json:"group" binding:"required"`
	Name  string `json:"name" binding:"required"`
}

// --- Achievements ---
type AchievementReq struct {
	Title         string `json:"title" binding:"required"`
	Issuer        string `json:"issuer" binding:"required"`
	Date          string `json:"date" binding:"required"`
	Description   string `json:"description"`
	CredentialURL string `json:"credential_url"`
	LinkText      string `json:"link_text"`
}

// --- Experiences ---
type ExperienceReq struct {
	Type        string  `json:"type" binding:"required"`
	Title       string  `json:"title" binding:"required"`
	EntityName  string  `json:"entity_name" binding:"required"`
	Location    string  `json:"location"`
	Description string  `json:"description"`
	StartDate   string  `json:"start_date" binding:"required"`
	EndDate     *string `json:"end_date"`
	SortOrder   int     `json:"sort_order"`
}

// --- Profile ---
type SocialLinkReq struct {
	Name   string `json:"name"`
	URL    string `json:"url"`
	Icon   string `json:"icon"`
	Active bool   `json:"active"`
}

type ProfileReq struct {
	FullName        string          `json:"full_name"`
	Headline        string          `json:"headline"`
	Bio             string          `json:"bio"`
	PhotoURL        string          `json:"photo_url"`
	Location        string          `json:"location"`
	ResumeURL       string          `json:"resume_url"`
	SkillGroupOrder string          `json:"skill_group_order"`
	Socials         []SocialLinkReq `json:"socials"`
}

// --- Analytics ---
type TrackVisitReq struct {
	Path string `json:"path" binding:"required"`
}

// --- Contact ---
type ContactReq struct {
	Name    string `json:"name" binding:"required"`
	Email   string `json:"email" binding:"required,email"`
	Message string `json:"message" binding:"required"`
}
