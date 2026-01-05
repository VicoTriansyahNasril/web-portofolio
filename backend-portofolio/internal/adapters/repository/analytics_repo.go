package repository

import (
	"backend-portofolio/internal/core/domain"
	"backend-portofolio/internal/core/ports"

	"gorm.io/gorm"
)

type analyticsRepo struct {
	db *gorm.DB
}

func NewAnalyticsRepo(db *gorm.DB) ports.AnalyticsRepository {
	return &analyticsRepo{db: db}
}

func (r *analyticsRepo) RecordVisit(visit *domain.PageVisit) error {
	return r.db.Create(visit).Error
}

func (r *analyticsRepo) GetVisitorSummaries() ([]domain.VisitorSummary, error) {
	var results []domain.VisitorSummary

	err := r.db.Model(&domain.PageVisit{}).
		Select("visitor_hash, MIN(timestamp) as first_visit, MAX(timestamp) as last_visit, COUNT(*) as total_page_views").
		Group("visitor_hash").
		Find(&results).Error

	return results, err
}

func (r *analyticsRepo) GetVisitsByHash(hash string) ([]domain.PageVisit, error) {
	var visits []domain.PageVisit
	err := r.db.Where("visitor_hash = ?", hash).Order("timestamp desc").Find(&visits).Error
	return visits, err
}
