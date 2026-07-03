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

func (s *achievementService) GetPublicAchievements(ctx context.Context) ([]domain.Achievement, error) {
	const cacheKey = "public_achievements"
	cached, err := cache.Get(cacheKey)
	if err == nil {
		var items []domain.Achievement
		if err := json.Unmarshal([]byte(cached), &items); err == nil {
			return items, nil
		}
	}

	items, err := s.repo.ListPublic(ctx)
	if err != nil {
		return nil, err
	}

	jsonData, _ := json.Marshal(items)
	cache.Set(cacheKey, jsonData, 300000000000)
	return items, nil
}

func (s *achievementService) GetAdminAchievements(ctx context.Context) ([]domain.Achievement, error) {
	return s.repo.ListAdmin(ctx)
}

func (s *achievementService) CreateAchievement(ctx context.Context, req dto.AchievementReq) error {
	date, err := time.Parse(time.RFC3339, req.Date)
	if err != nil {
		date, err = time.Parse("2006-01-02", req.Date)
		if err != nil {
			log.Printf("Date parsing error: %v", err)
			return err
		}
	}

	maxOrder, err := s.repo.GetMaxSortOrder(ctx)
	if err != nil {
		log.Printf("Warning: GetMaxSortOrder failed: %v", err)
		maxOrder = 0
	}
	nextOrder := maxOrder + 1

	achievement := domain.Achievement{
		Title:         req.Title,
		Issuer:        req.Issuer,
		Date:          date,
		Description:   req.Description,
		CredentialURL: req.CredentialURL,
		LinkText:      req.LinkText,
		SortOrder:     nextOrder,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}

	if err := s.repo.Create(ctx, &achievement); err != nil {
		log.Printf("DB Create Error: %v", err)
		return err
	}
	s.invalidateCache()
	return nil
}

func (s *achievementService) UpdateAchievement(ctx context.Context, id uint, req dto.AchievementReq) error {
	date, err := time.Parse(time.RFC3339, req.Date)
	if err != nil {
		date, err = time.Parse("2006-01-02", req.Date)
		if err != nil {
			return err
		}
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

	if err := s.repo.Update(ctx, &achievement); err != nil {
		return err
	}
	s.invalidateCache()
	return nil
}

func (s *achievementService) DeleteAchievement(ctx context.Context, id uint) error {
	if err := s.repo.Delete(ctx, id); err != nil {
		return err
	}
	s.invalidateCache()
	return nil
}

func (s *achievementService) ReorderAchievements(ctx context.Context, orders []struct {
	ID        uint `json:"id"`
	SortOrder int  `json:"sort_order"`
}) error {
	if err := s.repo.Reorder(ctx, orders); err != nil {
		return err
	}
	s.invalidateCache()
	return nil
}
