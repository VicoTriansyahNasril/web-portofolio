package services

import (
	"backend-portofolio/internal/cache"
	"backend-portofolio/internal/core/domain"
	"backend-portofolio/internal/core/ports"
	"backend-portofolio/internal/websocket"
	"encoding/json"
	"time"
)

type profileService struct {
	repo ports.ProfileRepository
}

func NewProfileService(repo ports.ProfileRepository) ports.ProfileService {
	return &profileService{repo: repo}
}

const publicProfileCacheKey = "public_profile"

func (s *profileService) invalidateCache() {
	cache.DelByPattern(publicProfileCacheKey + "*")
	hub := websocket.GetHub()
	hub.BroadcastEvent("change", "/api/profile")
}

func (s *profileService) GetPublicProfile() (*domain.Profile, error) {
	cached, err := cache.Get(publicProfileCacheKey)
	if err == nil {
		var p domain.Profile
		if err := json.Unmarshal([]byte(cached), &p); err == nil {
			return &p, nil
		}
	}

	p, err := s.repo.Get()
	if err != nil {
		return nil, err
	}

	jsonData, _ := json.Marshal(p)
	cache.Set(publicProfileCacheKey, jsonData, 5*time.Minute)
	return p, nil
}

func (s *profileService) UpdateProfile(reqProfile domain.Profile, reqSocials []domain.SocialLink) error {
	existing, err := s.repo.Get()
	if err == nil && existing != nil {
		reqProfile.ID = existing.ID
	}

	if err := s.repo.Upsert(&reqProfile); err != nil {
		return err
	}
	if err := s.repo.UpdateSocialLinks(reqProfile.ID, reqSocials); err != nil {
		return err
	}
	s.invalidateCache()
	return nil
}
