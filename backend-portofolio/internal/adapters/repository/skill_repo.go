package repository

import (
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

func (r *skillRepo) ListPublic() ([]domain.Skill, error) {
	var skills []domain.Skill
	err := r.db.Order("sort_order asc, name asc").Find(&skills).Error
	return skills, err
}

func (r *skillRepo) ListAdmin() ([]domain.Skill, error) {
	var skills []domain.Skill
	err := r.db.Order("sort_order asc").Find(&skills).Error
	return skills, err
}

func (r *skillRepo) Create(skill *domain.Skill) error {
	return r.db.Create(skill).Error
}

func (r *skillRepo) Update(skill *domain.Skill) error {
	return r.db.Save(skill).Error
}

func (r *skillRepo) Delete(id uint) error {
	return r.db.Delete(&domain.Skill{}, id).Error
}

func (r *skillRepo) Reorder(orders []struct {
	ID        uint `json:"id"`
	SortOrder int  `json:"sort_order"`
}) error {
	tx := r.db.Begin()
	for _, o := range orders {
		if err := tx.Model(&domain.Skill{}).Where("id = ?", o.ID).
			Updates(map[string]interface{}{"sort_order": o.SortOrder, "updated_at": time.Now()}).Error; err != nil {
			tx.Rollback()
			return err
		}
	}
	return tx.Commit().Error
}
