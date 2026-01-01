package services

import (
	"backend-portofolio/internal/cache"
	"backend-portofolio/internal/db"
	"backend-portofolio/internal/dto"
	"backend-portofolio/internal/models"
	"backend-portofolio/internal/websocket"
	"database/sql"
	"encoding/json"
	"regexp"
	"strings"
	"time"
)

type ProjectService struct{}

var nonAlnum = regexp.MustCompile(`[^a-z0-9]+`)

func (s *ProjectService) InvalidateCache(slug string) {
	cache.DelByPattern("project*")
	cache.DelByPattern("public_projects*")
	hub := websocket.GetHub()
	hub.BroadcastEvent("change", "/api/projects")
	if slug != "" {
		hub.BroadcastEvent("change", "/api/projects/"+slug)
	}
}

func (s *ProjectService) NormSlug(slug string) string {
	slug = strings.ToLower(strings.TrimSpace(slug))
	slug = nonAlnum.ReplaceAllString(slug, "-")
	return strings.Trim(slug, "-")
}

func (s *ProjectService) parseDate(d string) *time.Time {
	if d == "" {
		return nil
	}
	t, err := time.Parse(time.RFC3339, d)
	if err != nil {
		return nil
	}
	return &t
}

func (s *ProjectService) toGalleryJSON(arr []string) string {
	if len(arr) == 0 {
		return "[]"
	}
	b, _ := json.Marshal(arr)
	return string(b)
}

func (s *ProjectService) Create(req dto.CreateProjectReq) (*models.Project, error) {
	var max sql.NullInt64
	row := db.Conn.Model(&models.Project{}).Select("MAX(sort_order)").Row()
	_ = row.Scan(&max)
	next := 0
	if max.Valid {
		next = int(max.Int64) + 1
	}

	p := models.Project{
		Slug:        s.NormSlug(req.Slug),
		Title:       strings.TrimSpace(req.Title),
		Summary:     strings.TrimSpace(req.Summary),
		Body:        req.Body,
		CoverURL:    strings.TrimSpace(req.CoverURL),
		RepoURL:     strings.TrimSpace(req.RepoURL),
		DemoURL:     strings.TrimSpace(req.DemoURL),
		Role:        strings.TrimSpace(req.Role),
		Status:      req.Status,
		IsFeatured:  req.IsFeatured,
		GalleryJSON: s.toGalleryJSON(req.Gallery),
		SortOrder:   &next,
		TechStack:   req.TechStack,
		StartDate:   s.parseDate(req.StartDate),
		EndDate:     s.parseDate(req.EndDate),
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	if p.Status == "" {
		p.Status = "published"
	}

	if err := db.Conn.Create(&p).Error; err != nil {
		return nil, err
	}
	s.InvalidateCache("")
	return &p, nil
}

func (s *ProjectService) Update(id string, req dto.UpdateProjectReq) error {
	var p models.Project
	if err := db.Conn.First(&p, id).Error; err != nil {
		return err
	}

	if req.Slug != nil {
		p.Slug = s.NormSlug(*req.Slug)
	}
	if req.Title != nil {
		p.Title = strings.TrimSpace(*req.Title)
	}
	if req.Summary != nil {
		p.Summary = strings.TrimSpace(*req.Summary)
	}
	if req.Body != nil {
		p.Body = *req.Body
	}
	if req.CoverURL != nil {
		p.CoverURL = strings.TrimSpace(*req.CoverURL)
	}
	if req.RepoURL != nil {
		p.RepoURL = strings.TrimSpace(*req.RepoURL)
	}
	if req.DemoURL != nil {
		p.DemoURL = strings.TrimSpace(*req.DemoURL)
	}
	if req.Role != nil {
		p.Role = strings.TrimSpace(*req.Role)
	}
	if req.Status != nil {
		p.Status = strings.TrimSpace(*req.Status)
	}
	if req.IsFeatured != nil {
		p.IsFeatured = *req.IsFeatured
	}
	if req.Gallery != nil {
		p.GalleryJSON = s.toGalleryJSON(*req.Gallery)
	}
	if req.SortOrder != nil {
		p.SortOrder = req.SortOrder
	}
	if req.TechStack != nil {
		p.TechStack = *req.TechStack
	}
	if req.StartDate != nil {
		p.StartDate = s.parseDate(*req.StartDate)
	}
	if req.EndDate != nil {
		p.EndDate = s.parseDate(*req.EndDate)
	}
	p.UpdatedAt = time.Now()

	if err := db.Conn.Save(&p).Error; err != nil {
		return err
	}
	s.InvalidateCache(p.Slug)
	return nil
}

func (s *ProjectService) Reorder(req dto.ReorderProjectReq) error {
	tx := db.Conn.Begin()
	now := time.Now()
	for _, o := range req.Orders {
		if err := tx.Model(&models.Project{}).Where("id = ?", o.ID).
			Updates(map[string]any{"sort_order": o.SortOrder, "updated_at": now}).Error; err != nil {
			tx.Rollback()
			return err
		}
	}
	if err := tx.Commit().Error; err != nil {
		return err
	}
	s.InvalidateCache("")
	return nil
}

func (s *ProjectService) Delete(id string) error {
	if err := db.Conn.Delete(&models.Project{}, id).Error; err != nil {
		return err
	}
	s.InvalidateCache("")
	return nil
}

func (s *ProjectService) GetPublicBySlug(slug string) (*models.Project, error) {
	var p models.Project
	slug = s.NormSlug(slug)
	if err := db.Conn.Where("slug = ? AND status = ?", slug, "published").First(&p).Error; err != nil {
		return nil, err
	}
	return &p, nil
}

func (s *ProjectService) GetAllPublic() ([]models.Project, error) {
	var items []models.Project
	err := db.Conn.Where("status = ?", "published").
		Order("CASE WHEN sort_order IS NULL THEN 1 ELSE 0 END, sort_order ASC, created_at DESC").
		Find(&items).Error
	return items, err
}

func (s *ProjectService) GetAllAdmin() ([]models.Project, error) {
	var items []models.Project
	err := db.Conn.Order("CASE WHEN sort_order IS NULL THEN 1 ELSE 0 END, sort_order ASC, created_at DESC").
		Find(&items).Error
	return items, err
}

func (s *ProjectService) GetAdminByID(id string) (*models.Project, error) {
	var p models.Project
	if err := db.Conn.First(&p, id).Error; err != nil {
		return nil, err
	}
	return &p, nil
}
