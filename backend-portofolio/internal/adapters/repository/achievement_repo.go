package repository

import (
	"context"
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

func (r *achievementRepo) ListPublic(ctx context.Context) ([]domain.Achievement, error) {
	var items []domain.Achievement
	err := r.db.WithContext(ctx).Order("sort_order asc, date desc").Find(&items).Error
	return items, err
}

func (r *achievementRepo) ListAdmin(ctx context.Context) ([]domain.Achievement, error) {
	var items []domain.Achievement
	err := r.db.WithContext(ctx).Order("sort_order asc, date desc").Find(&items).Error
	return items, err
}

func (r *achievementRepo) Create(ctx context.Context, achievement *domain.Achievement) error {
	return r.db.WithContext(ctx).Create(achievement).Error
}

func (r *achievementRepo) Update(ctx context.Context, achievement *domain.Achievement) error {
	return r.db.WithContext(ctx).Save(achievement).Error
}

func (r *achievementRepo) Delete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&domain.Achievement{}, id).Error
}

func (r *achievementRepo) Reorder(ctx context.Context, orders []struct {
	ID        uint `json:"id"`
	SortOrder int  `json:"sort_order"`
}) error {
	tx := r.db.WithContext(ctx).Begin()
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

func (r *achievementRepo) GetMaxSortOrder(ctx context.Context) (int, error) {
	var max sql.NullInt64
	row := r.db.WithContext(ctx).Model(&domain.Achievement{}).Select("MAX(sort_order)").Row()
	if err := row.Scan(&max); err != nil {
		return 0, err
	}
	if max.Valid {
		return int(max.Int64), nil
	}
	return 0, nil
}
