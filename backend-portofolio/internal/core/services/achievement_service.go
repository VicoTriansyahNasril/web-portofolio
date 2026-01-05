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

type achievementService struct {
	repo ports.AchievementRepository
}

func NewAchievementService(repo ports.AchievementRepository) ports.AchievementService {
	return &achievementService{repo: repo}
}

func (s *achievementService) invalidateCache() {
	cache.DelByPattern("public_achievements*")
	hub := websocket.GetHub()
	hub.BroadcastEvent("change", "/api/achievements")
}

func (s *achievementService) GetPublicAchievements() ([]domain.Achievement, error) {
	const cacheKey = "public_achievements"
	cached, err := cache.Get(cacheKey)
	if err == nil {
		var items []domain.Achievement
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

func (s *achievementService) GetAdminAchievements() ([]domain.Achievement, error) {
	return s.repo.ListAdmin()
}

func (s *achievementService) CreateAchievement(req dto.AchievementReq) error {
	date, err := time.Parse(time.RFC3339, req.Date)
	if err != nil {
		return err
	}

	achievement := domain.Achievement{
		Title:         req.Title,
		Issuer:        req.Issuer,
		Date:          date,
		Description:   req.Description,
		CredentialURL: req.CredentialURL,
		LinkText:      req.LinkText,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}

	if err := s.repo.Create(&achievement); err != nil {
		return err
	}
	s.invalidateCache()
	return nil
}

func (s *achievementService) UpdateAchievement(id uint, req dto.AchievementReq) error {
	date, err := time.Parse(time.RFC3339, req.Date)
	if err != nil {
		return err
	}

	achievement := domain.Achievement{
		ID:            id,
		Title:         req.Title,
		Issuer:        req.Issuer,
		Date:          date,
		Description:   req.Description,
		CredentialURL: req.CredentialURL,
		LinkText:      req.LinkText,
		UpdatedAt:     time.Now(),
	}

	if err := s.repo.Update(&achievement); err != nil {
		return err
	}
	s.invalidateCache()
	return nil
}

func (s *achievementService) DeleteAchievement(id uint) error {
	if err := s.repo.Delete(id); err != nil {
		return err
	}
	s.invalidateCache()
	return nil
}

func (s *achievementService) ReorderAchievements(orders []struct {
	ID        uint `json:"id"`
	SortOrder int  `json:"sort_order"`
}) error {
	if err := s.repo.Reorder(orders); err != nil {
		return err
	}
	s.invalidateCache()
	return nil
}
