package services

import (
	"context"
	"backend-portofolio/internal/cache"
	"backend-portofolio/internal/core/domain"
	"backend-portofolio/internal/core/ports"
	"backend-portofolio/internal/dto"
	"backend-portofolio/internal/websocket"
	"encoding/json"
	"log"
	"regexp"
	"strings"
	"time"
)

type projectService struct {
	repo ports.ProjectRepository
}

func NewProjectService(repo ports.ProjectRepository) ports.ProjectService {
	return &projectService{repo: repo}
}

var nonAlnum = regexp.MustCompile(`[^a-z0-9]+`)

func (s *projectService) normSlug(slug string) string {
	slug = strings.ToLower(strings.TrimSpace(slug))
	slug = nonAlnum.ReplaceAllString(slug, "-")
	return strings.Trim(slug, "-")
}

func (s *projectService) truncate(text string, length int) string {
	if len(text) <= length {
		return text
	}
	return text[:length]
}

func (s *projectService) parseDate(d string) *time.Time {
	if d == "" {
		return nil
	}
	t, err := time.Parse(time.RFC3339, d)
	if err == nil {
		return &t
	}
	t, err = time.Parse("2006-01-02", d)
	if err == nil {
		return &t
	}
	return nil
}

func (s *projectService) toGalleryJSON(arr []string) string {
	if len(arr) == 0 {
		return "[]"
	}
	b, _ := json.Marshal(arr)
	return string(b)
}

func (s *projectService) invalidateCache(slug string) {
	cache.DelByPattern("project*")
	cache.DelByPattern("public_projects*")
	hub := websocket.GetHub()
	hub.BroadcastEvent("change", "/api/projects")
	if slug != "" {
		hub.BroadcastEvent("change", "/api/projects/"+slug)
	}
}

func (s *projectService) GetPublicList(ctx context.Context) ([]domain.Project, error) {
	return s.repo.FindAllPublic(ctx)
}

func (s *projectService) GetPublicBySlug(ctx context.Context, slug string) (*domain.Project, error) {
	slug = s.normSlug(slug)
	return s.repo.FindBySlug(ctx, slug)
}

func (s *projectService) GetAdminList(ctx context.Context) ([]domain.Project, error) {
	return s.repo.FindAllAdmin(ctx)
}

func (s *projectService) GetAdminByID(ctx context.Context, id uint) (*domain.Project, error) {
	return s.repo.FindByID(ctx, id)
}

func (s *projectService) CreateProject(ctx context.Context, req dto.CreateProjectReq) (*domain.Project, error) {
	maxOrder, err := s.repo.GetMaxSortOrder(ctx)
	if err != nil {
		log.Printf("Warning: GetMaxSortOrder failed: %v", err)
		maxOrder = 0
	}
	nextOrder := maxOrder + 1

	now := time.Now()
	startDate := s.parseDate(req.StartDate)

	p := domain.Project{
		Slug:        s.truncate(s.normSlug(req.Slug), 160),
		Title:       s.truncate(strings.TrimSpace(req.Title), 220),
		Summary:     s.truncate(strings.TrimSpace(req.Summary), 1000),
		Body:        req.Body,
		CoverURL:    s.truncate(strings.TrimSpace(req.CoverURL), 500),
		RepoURL:     s.truncate(strings.TrimSpace(req.RepoURL), 500),
		DemoURL:     s.truncate(strings.TrimSpace(req.DemoURL), 500),
		Role:        s.truncate(strings.TrimSpace(req.Role), 40),
		Status:      req.Status,
		IsFeatured:  req.IsFeatured,
		GalleryJSON: s.toGalleryJSON(req.Gallery),
		SortOrder:   &nextOrder,
		TechStack:   s.truncate(req.TechStack, 500),
		StartDate:   startDate,
		EndDate:     s.parseDate(req.EndDate),
		CreatedAt:   now,
		UpdatedAt:   now,
	}

	if p.Status == "" {
		p.Status = "published"
	}

	if err := s.repo.Create(ctx, &p); err != nil {
		log.Printf("DB Create Error: %v | Slug: %s", err, p.Slug)
		return nil, err
	}
	s.invalidateCache("")
	return &p, nil
}

func (s *projectService) UpdateProject(ctx context.Context, id uint, req dto.UpdateProjectReq) error {
	p, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return err
	}

	if req.Slug != nil {
		p.Slug = s.truncate(s.normSlug(*req.Slug), 160)
	}
	if req.Title != nil {
		p.Title = s.truncate(strings.TrimSpace(*req.Title), 220)
	}
	if req.Summary != nil {
		p.Summary = s.truncate(strings.TrimSpace(*req.Summary), 1000)
	}
	if req.Body != nil {
		p.Body = *req.Body
	}
	if req.CoverURL != nil {
		p.CoverURL = s.truncate(strings.TrimSpace(*req.CoverURL), 500)
	}
	if req.RepoURL != nil {
		p.RepoURL = s.truncate(strings.TrimSpace(*req.RepoURL), 500)
	}
	if req.DemoURL != nil {
		p.DemoURL = s.truncate(strings.TrimSpace(*req.DemoURL), 500)
	}
	if req.Role != nil {
		p.Role = s.truncate(strings.TrimSpace(*req.Role), 40)
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
		p.TechStack = s.truncate(*req.TechStack, 500)
	}
	if req.StartDate != nil {
		p.StartDate = s.parseDate(*req.StartDate)
	}
	if req.EndDate != nil {
		p.EndDate = s.parseDate(*req.EndDate)
	}
	p.UpdatedAt = time.Now()

	if err := s.repo.Update(ctx, p); err != nil {
		log.Printf("DB Update Error: %v", err)
		return err
	}
	s.invalidateCache(p.Slug)
	return nil
}

func (s *projectService) DeleteProject(ctx context.Context, id uint) error {
	if err := s.repo.Delete(ctx, id); err != nil {
		return err
	}
	s.invalidateCache("")
	return nil
}

func (s *projectService) ReorderProjects(ctx context.Context, req dto.ReorderReq) error {
	now := time.Now()
	for _, o := range req.Orders {
		p, err := s.repo.FindByID(ctx, o.ID)
		if err == nil {
			p.SortOrder = &o.SortOrder
			p.UpdatedAt = now
			if err := s.repo.Update(ctx, p); err != nil {
				log.Printf("Failed to reorder project ID %d: %v", o.ID, err)
			}
		}
	}
	s.invalidateCache("")
	return nil
}
