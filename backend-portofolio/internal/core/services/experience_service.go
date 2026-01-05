package services

import (
	"backend-portofolio/internal/cache"
	"backend-portofolio/internal/core/domain"
	"backend-portofolio/internal/core/ports"
	"backend-portofolio/internal/dto"
	"backend-portofolio/internal/websocket"
	"encoding/json"
	"time"
)

type experienceService struct {
	repo ports.ExperienceRepository
}

func NewExperienceService(repo ports.ExperienceRepository) ports.ExperienceService {
	return &experienceService{repo: repo}
}

func (s *experienceService) invalidateCache() {
	cache.DelByPattern("public_experiences*")
	hub := websocket.GetHub()
	hub.BroadcastEvent("change", "/api/experiences")
}

func (s *experienceService) GetPublicExperiences() ([]domain.Experience, error) {
	const cacheKey = "public_experiences"
	cached, err := cache.Get(cacheKey)
	if err == nil {
		var items []domain.Experience
		if err := json.Unmarshal([]byte(cached), &items); err == nil {
			return items, nil
		}
	}

	items, err := s.repo.ListPublic()
	if err != nil {
		return nil, err
	}

	jsonData, _ := json.Marshal(items)
	cache.Set(cacheKey, jsonData, 5*time.Minute)
	return items, nil
}

func (s *experienceService) GetAdminExperiences() ([]domain.Experience, error) {
	return s.repo.ListAdmin()
}

func (s *experienceService) CreateExperience(req dto.ExperienceReq) error {
	startDate, err := time.Parse(time.RFC3339, req.StartDate)
	if err != nil {
		return err
	}

	var endDate *time.Time
	if req.EndDate != nil && *req.EndDate != "" {
		t, err := time.Parse(time.RFC3339, *req.EndDate)
		if err != nil {
			return err
		}
		endDate = &t
	}

	exp := domain.Experience{
		Type:        req.Type,
		Title:       req.Title,
		EntityName:  req.EntityName,
		Location:    req.Location,
		Description: req.Description,
		StartDate:   startDate,
		EndDate:     endDate,
		SortOrder:   req.SortOrder,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	if err := s.repo.Create(&exp); err != nil {
		return err
	}
	s.invalidateCache()
	return nil
}

func (s *experienceService) UpdateExperience(id uint, req dto.ExperienceReq) error {
	startDate, err := time.Parse(time.RFC3339, req.StartDate)
	if err != nil {
		return err
	}

	var endDate *time.Time
	if req.EndDate != nil && *req.EndDate != "" {
		t, err := time.Parse(time.RFC3339, *req.EndDate)
		if err != nil {
			return err
		}
		endDate = &t
	}

	exp := domain.Experience{
		ID:          id,
		Type:        req.Type,
		Title:       req.Title,
		EntityName:  req.EntityName,
		Location:    req.Location,
		Description: req.Description,
		StartDate:   startDate,
		EndDate:     endDate,
		SortOrder:   req.SortOrder,
		UpdatedAt:   time.Now(),
	}

	if err := s.repo.Update(&exp); err != nil {
		return err
	}
	s.invalidateCache()
	return nil
}

func (s *experienceService) DeleteExperience(id uint) error {
	if err := s.repo.Delete(id); err != nil {
		return err
	}
	s.invalidateCache()
	return nil
}
