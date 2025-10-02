// internal/models/experience.go
package models

import "time"

type Experience struct {
	ID          uint       `json:"id" gorm:"primaryKey"`
	Type        string     `json:"type" gorm:"size:50"`
	Title       string     `json:"title" gorm:"size:200"`
	EntityName  string     `json:"entity_name" gorm:"size:200"`
	Location    string     `json:"location" gorm:"size:200"`
	Description string     `json:"description" gorm:"type:text"`
	StartDate   time.Time  `json:"start_date"`
	EndDate     *time.Time `json:"end_date"`
	SortOrder   int        `json:"sort_order" gorm:"default:0"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}
