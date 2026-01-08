package repository

import (
	"backend-portofolio/internal/core/domain"
	"backend-portofolio/internal/core/ports"
	"database/sql"
	"time"

	"gorm.io/gorm"
)

type achievementRepo struct {
	db *gorm.DB
}

func NewAchievementRepo(db *gorm.DB) ports.AchievementRepository {
	return &achievementRepo{db: db}
}

func (r *achievementRepo) ListPublic() ([]domain.Achievement, error) {
	var items []domain.Achievement
	err := r.db.Order("sort_order asc, date desc").Find(&items).Error
	return items, err
}

func (r *achievementRepo) ListAdmin() ([]domain.Achievement, error) {
	var items []domain.Achievement
	err := r.db.Order("sort_order asc, date desc").Find(&items).Error
	return items, err
}

func (r *achievementRepo) Create(achievement *domain.Achievement) error {
	return r.db.Create(achievement).Error
}

func (r *achievementRepo) Update(achievement *domain.Achievement) error {
	return r.db.Save(achievement).Error
}

func (r *achievementRepo) Delete(id uint) error {
	return r.db.Delete(&domain.Achievement{}, id).Error
}

func (r *achievementRepo) Reorder(orders []struct {
	ID        uint `json:"id"`
	SortOrder int  `json:"sort_order"`
}) error {
	tx := r.db.Begin()
	now := time.Now()
	for _, o := range orders {
		if err := tx.Model(&domain.Achievement{}).
			Where("id = ?", o.ID).
			Updates(map[string]any{"sort_order": o.SortOrder, "updated_at": now}).Error; err != nil {
			tx.Rollback()
			return err
		}
	}
	return tx.Commit().Error
}

func (r *achievementRepo) GetMaxSortOrder() (int, error) {
	var max sql.NullInt64
	row := r.db.Model(&domain.Achievement{}).Select("MAX(sort_order)").Row()
	if err := row.Scan(&max); err != nil {
		return 0, err
	}
	if max.Valid {
		return int(max.Int64), nil
	}
	return 0, nil
}
