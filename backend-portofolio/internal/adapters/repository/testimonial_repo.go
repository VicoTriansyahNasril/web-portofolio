package repository

import (
	"backend-portofolio/internal/core/domain"
	"backend-portofolio/internal/core/ports"
	"backend-portofolio/internal/dto"
	"context"
	"database/sql"
	"time"

	"gorm.io/gorm"
)

type testimonialRepo struct {
	db *gorm.DB
}

func NewTestimonialRepo(db *gorm.DB) ports.TestimonialRepository {
	return &testimonialRepo{db: db}
}

func (r *testimonialRepo) ListPublic(ctx context.Context) ([]domain.Testimonial, error) {
	var items []domain.Testimonial
	err := r.db.WithContext(ctx).Where("is_visible = ?", true).
		Order("CASE WHEN sort_order IS NULL THEN 1 ELSE 0 END, sort_order ASC, created_at DESC").
		Find(&items).Error
	return items, err
}

func (r *testimonialRepo) ListAdmin(ctx context.Context) ([]domain.Testimonial, error) {
	var items []domain.Testimonial
	err := r.db.WithContext(ctx).
		Order("CASE WHEN sort_order IS NULL THEN 1 ELSE 0 END, sort_order ASC, created_at DESC").
		Find(&items).Error
	return items, err
}

func (r *testimonialRepo) FindByID(ctx context.Context, id uint) (*domain.Testimonial, error) {
	var item domain.Testimonial
	if err := r.db.WithContext(ctx).First(&item, id).Error; err != nil {
		return nil, err
	}
	return &item, nil
}

func (r *testimonialRepo) Create(ctx context.Context, testimonial *domain.Testimonial) error {
	return r.db.WithContext(ctx).Create(testimonial).Error
}

func (r *testimonialRepo) Update(ctx context.Context, testimonial *domain.Testimonial) error {
	return r.db.WithContext(ctx).Save(testimonial).Error
}

func (r *testimonialRepo) Delete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&domain.Testimonial{}, id).Error
}

func (r *testimonialRepo) GetMaxSortOrder(ctx context.Context) (int, error) {
	var max sql.NullInt64
	row := r.db.WithContext(ctx).Model(&domain.Testimonial{}).Select("MAX(sort_order)").Row()
	if err := row.Scan(&max); err != nil {
		return 0, err
	}
	if max.Valid {
		return int(max.Int64), nil
	}
	return 0, nil
}

func (r *testimonialRepo) Reorder(ctx context.Context, orders []dto.ReorderItem) error {
	tx := r.db.WithContext(ctx).Begin()
	for _, o := range orders {
		if err := tx.Model(&domain.Testimonial{}).Where("id = ?", o.ID).
			Updates(map[string]interface{}{"sort_order": o.SortOrder, "updated_at": time.Now()}).Error; err != nil {
			tx.Rollback()
			return err
		}
	}
	return tx.Commit().Error
}
