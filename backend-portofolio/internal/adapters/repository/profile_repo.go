package repository

import (
	"backend-portofolio/internal/core/domain"
	"backend-portofolio/internal/core/ports"

	"gorm.io/gorm"
)

type profileRepo struct {
	db *gorm.DB
}

func NewProfileRepo(db *gorm.DB) ports.ProfileRepository {
	return &profileRepo{db: db}
}

func (r *profileRepo) Get() (*domain.Profile, error) {
	var p domain.Profile
	err := r.db.Preload("Socials").First(&p).Error
	if err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *profileRepo) Upsert(profile *domain.Profile) error {
	return r.db.Save(profile).Error
}

func (r *profileRepo) UpdateSocialLinks(profileID uint, links []domain.SocialLink) error {
	tx := r.db.Begin()
	if err := tx.Where("profile_id = ?", profileID).Delete(&domain.SocialLink{}).Error; err != nil {
		tx.Rollback()
		return err
	}
	if len(links) > 0 {
		for i := range links {
			links[i].ProfileID = profileID
		}
		if err := tx.Create(&links).Error; err != nil {
			tx.Rollback()
			return err
		}
	}
	return tx.Commit().Error
}
