package repository

import (
	"context"
	"backend-portofolio/internal/core/domain"
	"backend-portofolio/internal/core/ports"

	"gorm.io/gorm"
)

type experienceRepo struct {
	db *gorm.DB
}

func NewExperienceRepo(db *gorm.DB) ports.ExperienceRepository {
	return &experienceRepo{db: db}
}

func (r *experienceRepo) ListPublic(ctx context.Context) ([]domain.Experience, error) {
	var items []domain.Experience
	err := r.db.WithContext(ctx).Order("sort_order asc, start_date desc").Find(&items).Error
	return items, err
}

func (r *experienceRepo) ListAdmin(ctx context.Context) ([]domain.Experience, error) {
	var items []domain.Experience
	err := r.db.WithContext(ctx).Order("sort_order asc, start_date desc").Find(&items).Error
	return items, err
}

func (r *experienceRepo) Create(ctx context.Context, experience *domain.Experience) error {
	return r.db.WithContext(ctx).Create(experience).Error
}

func (r *experienceRepo) Update(ctx context.Context, experience *domain.Experience) error {
	return r.db.WithContext(ctx).Save(experience).Error
}

func (r *experienceRepo) Delete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&domain.Experience{}, id).Error
}
