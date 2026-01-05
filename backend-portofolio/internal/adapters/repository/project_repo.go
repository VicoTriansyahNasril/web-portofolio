package repository

import (
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

func (r *projectRepo) Create(project *domain.Project) error {
	return r.db.Create(project).Error
}

func (r *projectRepo) Update(project *domain.Project) error {
	return r.db.Save(project).Error
}

func (r *projectRepo) Delete(id uint) error {
	return r.db.Delete(&domain.Project{}, id).Error
}

func (r *projectRepo) FindByID(id uint) (*domain.Project, error) {
	var p domain.Project
	if err := r.db.First(&p, id).Error; err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *projectRepo) FindBySlug(slug string) (*domain.Project, error) {
	var p domain.Project
	if err := r.db.Where("slug = ? AND status = ?", slug, "published").First(&p).Error; err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *projectRepo) FindAllPublic() ([]domain.Project, error) {
	var items []domain.Project
	err := r.db.Where("status = ?", "published").
		Order("CASE WHEN sort_order IS NULL THEN 1 ELSE 0 END, sort_order ASC, created_at DESC").
		Find(&items).Error
	return items, err
}

func (r *projectRepo) FindAllAdmin() ([]domain.Project, error) {
	var items []domain.Project
	err := r.db.Order("CASE WHEN sort_order IS NULL THEN 1 ELSE 0 END, sort_order ASC, created_at DESC").
		Find(&items).Error
	return items, err
}

func (r *projectRepo) GetMaxSortOrder() (int, error) {
	var max sql.NullInt64
	row := r.db.Model(&domain.Project{}).Select("MAX(sort_order)").Row()
	if err := row.Scan(&max); err != nil {
		return 0, err
	}
	if max.Valid {
		return int(max.Int64), nil
	}
	return 0, nil
}
