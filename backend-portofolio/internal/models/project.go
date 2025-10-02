// internal/models/project.go
package models

import "time"

type Project struct {
	ID          uint   `json:"id" gorm:"primaryKey"`
	Slug        string `json:"slug" gorm:"uniqueIndex;size:160;not null"`
	Title       string `json:"title" gorm:"size:220;not null"`

	Summary     string `json:"summary" gorm:"size:1000"`
	Body        string `json:"body" gorm:"type:text"`
	CoverURL    string `json:"cover_url" gorm:"size:500"`
	RepoURL     string `json:"repo_url" gorm:"size:500"`
	DemoURL     string `json:"demo_url" gorm:"size:500"`
	TechStack   string `json:"tech_stack" gorm:"size:500"`

	GalleryJSON string `json:"gallery_json" gorm:"type:text"`
	Role        string `json:"role" gorm:"size:40"`
	Status      string `json:"status" gorm:"size:20;default:published"`
	IsFeatured  bool   `json:"is_featured" gorm:"default:false"`
	ViewCount   int    `json:"view_count" gorm:"default:0"`

	SortOrder *int `json:"sort_order" gorm:"index"`

	StartDate *time.Time `json:"start_date"`
	EndDate   *time.Time `json:"end_date"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
}