package domain

import "time"

type PageVisit struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Path        string    `gorm:"type:text;not null" json:"path"`
	VisitorHash string    `gorm:"type:varchar(255);not null;index" json:"visitor_hash"`
	Timestamp   time.Time `json:"timestamp"`
}

type VisitorSummary struct {
	VisitorHash    string
	FirstVisit     string
	LastVisit      string
	TotalPageViews int64
}
