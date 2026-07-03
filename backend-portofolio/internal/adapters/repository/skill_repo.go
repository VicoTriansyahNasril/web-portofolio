package repository

import (
	"context"
	"backend-portofolio/internal/core/domain"
	"backend-portofolio/internal/core/ports"
	"time"

	"gorm.io/gorm"
)

type skillRepo struct {
	db *gorm.DB
}

func NewSkillRepo(db *gorm.DB) ports.SkillRepository {
	return &skillRepo{db: db}
}

func (r *skillRepo) ListPublic(ctx context.Context) ([]domain.Skill, error) {
	var skills []domain.Skill
	err := r.db.WithContext(ctx).Order("sort_order asc, name asc").Find(&skills).Error
	return skills, err
}

func (r *skillRepo) ListAdmin(ctx context.Context) ([]domain.Skill, error) {
	var skills []domain.Skill
	err := r.db.WithContext(ctx).Order("sort_order asc").Find(&skills).Error
	return skills, err
}

func (r *skillRepo) Create(ctx context.Context, skill *domain.Skill) error {
	return r.db.WithContext(ctx).Create(skill).Error
}

func (r *skillRepo) Update(ctx context.Context, skill *domain.Skill) error {
	return r.db.WithContext(ctx).Save(skill).Error
}

func (r *skillRepo) Delete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&domain.Skill{}, id).Error
}

func (r *skillRepo) Reorder(ctx context.Context, orders []struct {
	ID        uint `json:"id"`
	SortOrder int  `json:"sort_order"`
}) error {
	tx := r.db.WithContext(ctx).Begin()
	for _, o := range orders {
		if err := tx.Model(&domain.Skill{}).Where("id = ?", o.ID).
			Updates(map[string]interface{}{"sort_order": o.SortOrder, "updated_at": time.Now()}).Error; err != nil {
			tx.Rollback()
			return err
		}
	}
	return tx.Commit().Error
}
