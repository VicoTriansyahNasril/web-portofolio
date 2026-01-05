package services

import (
	"backend-portofolio/internal/cache"
	"backend-portofolio/internal/core/domain"
	"backend-portofolio/internal/core/ports"
	"backend-portofolio/internal/websocket"
	"encoding/json"
	"sort"
	"time"
)

type skillService struct {
	repo        ports.SkillRepository
	profileRepo ports.ProfileRepository
}

func NewSkillService(repo ports.SkillRepository, profileRepo ports.ProfileRepository) ports.SkillService {
	return &skillService{
		repo:        repo,
		profileRepo: profileRepo,
	}
}

func (s *skillService) invalidateCache() {
	cache.DelByPattern("public_skills*")
	cache.DelByPattern("public_profile*")
	hub := websocket.GetHub()
	hub.BroadcastEvent("change", "/api/skills")
	hub.BroadcastEvent("change", "/api/profile")
}

func (s *skillService) GetPublicSkills() ([]domain.Skill, error) {
	const cacheKey = "public_skills_sorted"
	cached, err := cache.Get(cacheKey)
	if err == nil {
		var skills []domain.Skill
		if err := json.Unmarshal([]byte(cached), &skills); err == nil {
			return skills, nil
		}
	}

	skills, err := s.repo.ListPublic()
	if err != nil {
		return nil, err
	}

	profile, err := s.profileRepo.Get()
	if err == nil && profile.SkillGroupOrder != "" {
		var groupOrder []string
		if json.Unmarshal([]byte(profile.SkillGroupOrder), &groupOrder) == nil && len(groupOrder) > 0 {
			sort.SliceStable(skills, func(i, j int) bool {
				idxA := -1
				idxB := -1

				for k, g := range groupOrder {
					if g == skills[i].Group {
						idxA = k
					}
					if g == skills[j].Group {
						idxB = k
					}
				}

				if idxA != -1 && idxB != -1 {
					if idxA != idxB {
						return idxA < idxB
					}
					return skills[i].SortOrder < skills[j].SortOrder
				}

				if idxA != -1 {
					return true
				}
				if idxB != -1 {
					return false
				}

				return skills[i].SortOrder < skills[j].SortOrder
			})
		}
	} else {
		sort.SliceStable(skills, func(i, j int) bool {
			return skills[i].SortOrder < skills[j].SortOrder
		})
	}

	jsonData, _ := json.Marshal(skills)
	cache.Set(cacheKey, jsonData, 5*time.Minute)
	return skills, nil
}

func (s *skillService) GetAdminSkills() ([]domain.Skill, error) {
	return s.repo.ListAdmin()
}

func (s *skillService) CreateSkill(reqSkill domain.Skill) error {
	if err := s.repo.Create(&reqSkill); err != nil {
		return err
	}
	s.invalidateCache()
	return nil
}

func (s *skillService) UpdateSkill(id uint, reqSkill domain.Skill) error {
	reqSkill.ID = id
	if err := s.repo.Update(&reqSkill); err != nil {
		return err
	}
	s.invalidateCache()
	return nil
}

func (s *skillService) DeleteSkill(id uint) error {
	if err := s.repo.Delete(id); err != nil {
		return err
	}
	s.invalidateCache()
	return nil
}

func (s *skillService) ReorderSkills(orders []struct {
	ID        uint `json:"id"`
	SortOrder int  `json:"sort_order"`
}) error {
	if err := s.repo.Reorder(orders); err != nil {
		return err
	}
	s.invalidateCache()
	return nil
}
