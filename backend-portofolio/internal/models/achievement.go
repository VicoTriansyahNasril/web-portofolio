// internal/models/achievement.go
package models

import "time"

type Achievement struct {
	ID            uint      `json:"id" gorm:"primaryKey"`
	Title         string    `json:"title" gorm:"size:255"`
	Issuer        string    `json:"issuer" gorm:"size:150"`
	Date          time.Time `json:"date"`
	Description   string    `json:"description" gorm:"type:text"`
	CredentialURL string    `json:"credential_url" gorm:"size:500"`
	LinkText      string    `json:"link_text" gorm:"size:50"`
	SortOrder     int       `json:"sort_order" gorm:"default:0"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}