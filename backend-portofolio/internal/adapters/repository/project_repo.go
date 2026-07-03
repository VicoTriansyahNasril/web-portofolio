package repository

import (
	"context"
	"backend-portofolio/internal/core/domain"
	"backend-portofolio/internal/core/ports"
	"database/sql"

	"gorm.io/gorm"
)

type projectRepo struct {
	db *gorm.DB
}

func NewProjectRepo(db *gorm.DB) ports.ProjectRepository {
	return &projectRepo{db: db}
}

func (r *projectRepo) Create(ctx context.Context, project *domain.Project) error {
	return r.db.WithContext(ctx).Create(project).Error
}

func (r *projectRepo) Update(ctx context.Context, project *domain.Project) error {
	return r.db.WithContext(ctx).Save(project).Error
}

func (r *projectRepo) Delete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&domain.Project{}, id).Error
}

func (r *projectRepo) FindByID(ctx context.Context, id uint) (*domain.Project, error) {
	var p domain.Project
	if err := r.db.WithContext(ctx).First(&p, id).Error; err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *projectRepo) FindBySlug(ctx context.Context, slug string) (*domain.Project, error) {
	var p domain.Project
	if err := r.db.WithContext(ctx).Where("slug = ? AND status = ?", slug, "published").First(&p).Error; err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *projectRepo) FindAllPublic(ctx context.Context) ([]domain.Project, error) {
	var items []domain.Project
	err := r.db.WithContext(ctx).Where("status = ?", "published").
		Order("CASE WHEN sort_order IS NULL THEN 1 ELSE 0 END, sort_order ASC, created_at DESC").
		Find(&items).Error
	return items, err
}

func (r *projectRepo) FindAllAdmin(ctx context.Context) ([]domain.Project, error) {
	var items []domain.Project
	err := r.db.WithContext(ctx).Order("CASE WHEN sort_order IS NULL THEN 1 ELSE 0 END, sort_order ASC, created_at DESC").
		Find(&items).Error
	return items, err
}

func (r *projectRepo) GetMaxSortOrder(ctx context.Context) (int, error) {
	var max sql.NullInt64
	row := r.db.WithContext(ctx).Model(&domain.Project{}).Select("MAX(sort_order)").Row()
	if err := row.Scan(&max); err != nil {
		return 0, err
	}
	if max.Valid {
		return int(max.Int64), nil
	}
	return 0, nil
}
