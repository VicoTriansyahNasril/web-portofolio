package domain

import "time"

type Testimonial struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Name      string    `json:"name" gorm:"size:255;not null"`
	Role      string    `json:"role" gorm:"size:255"`
	Company   string    `json:"company" gorm:"size:255"`
	AvatarURL string    `json:"avatar_url" gorm:"size:500"`
	Content   string    `json:"content" gorm:"type:text;not null"`
	Rating    int       `json:"rating" gorm:"default:5"`
	IsVisible bool      `json:"is_visible" gorm:"default:true"`
	SortOrder *int      `json:"sort_order" gorm:"index"`
	CreatedAt time.Time `json:"created_at" gorm:"index"`
	UpdatedAt time.Time `json:"updated_at"`
}
