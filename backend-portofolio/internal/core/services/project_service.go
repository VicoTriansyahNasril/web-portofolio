package services

import (
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

func (s *projectService) GetPublicList() ([]domain.Project, error) {
	return s.repo.FindAllPublic()
}

func (s *projectService) GetPublicBySlug(slug string) (*domain.Project, error) {
	slug = s.normSlug(slug)
	return s.repo.FindBySlug(slug)
}

func (s *projectService) GetAdminList() ([]domain.Project, error) {
	return s.repo.FindAllAdmin()
}

func (s *projectService) GetAdminByID(id uint) (*domain.Project, error) {
	return s.repo.FindByID(id)
}

func (s *projectService) CreateProject(req dto.CreateProjectReq) (*domain.Project, error) {
	maxOrder, err := s.repo.GetMaxSortOrder()
	if err != nil {
		log.Printf("Warning: GetMaxSortOrder failed: %v", err)
		maxOrder = 0
	}
	nextOrder := maxOrder + 1

	now := time.Now()

	startDate := s.parseDate(req.StartDate)

	p := domain.Project{
		Slug:        s.normSlug(req.Slug),
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
		SortOrder:   &nextOrder,
		TechStack:   req.TechStack,
		StartDate:   startDate,
		EndDate:     s.parseDate(req.EndDate),
		CreatedAt:   now,
		UpdatedAt:   now,
	}

	if p.Status == "" {
		p.Status = "published"
	}

	if err := s.repo.Create(&p); err != nil {
		log.Printf("Error creating project: %v", err)
		return nil, err
	}
	s.invalidateCache("")
	return &p, nil
}

func (s *projectService) UpdateProject(id uint, req dto.UpdateProjectReq) error {
	p, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}

	if req.Slug != nil {
		p.Slug = s.normSlug(*req.Slug)
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

	if err := s.repo.Update(p); err != nil {
		return err
	}
	s.invalidateCache(p.Slug)
	return nil
}

func (s *projectService) DeleteProject(id uint) error {
	if err := s.repo.Delete(id); err != nil {
		return err
	}
	s.invalidateCache("")
	return nil
}

func (s *projectService) ReorderProjects(req dto.ReorderReq) error {
	now := time.Now()
	for _, o := range req.Orders {
		p, err := s.repo.FindByID(o.ID)
		if err == nil {
			p.SortOrder = &o.SortOrder
			p.UpdatedAt = now
			_ = s.repo.Update(p)
		}
	}
	s.invalidateCache("")
	return nil
}
