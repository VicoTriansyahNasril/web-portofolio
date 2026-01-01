package dto

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

type ReorderProjectReq struct {
	Orders []struct {
		ID        uint `json:"id"`
		SortOrder int  `json:"sort_order"`
	} `json:"orders"`
}
