package repository

import (
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

func (r *experienceRepo) ListPublic() ([]domain.Experience, error) {
	var items []domain.Experience
	err := r.db.Order("sort_order asc, start_date desc").Find(&items).Error
	return items, err
}

func (r *experienceRepo) ListAdmin() ([]domain.Experience, error) {
	var items []domain.Experience
	err := r.db.Order("sort_order asc, start_date desc").Find(&items).Error
	return items, err
}

func (r *experienceRepo) Create(experience *domain.Experience) error {
	return r.db.Create(experience).Error
}

func (r *experienceRepo) Update(experience *domain.Experience) error {
	return r.db.Save(experience).Error
}

func (r *experienceRepo) Delete(id uint) error {
	return r.db.Delete(&domain.Experience{}, id).Error
}
