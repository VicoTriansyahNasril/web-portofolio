// internal/models/skill.go
package models

import "time"

type Skill struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Group     string    `json:"group"`
	Name      string    `json:"name"`
	SortOrder int       `json:"sort_order" gorm:"default:0"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
