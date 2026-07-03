package repository

import (
	"context"
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

func (r *profileRepo) Get(ctx context.Context) (*domain.Profile, error) {
	var p domain.Profile
	err := r.db.WithContext(ctx).Preload("Socials").First(&p).Error
	if err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *profileRepo) Upsert(ctx context.Context, profile *domain.Profile) error {
	return r.db.WithContext(ctx).Save(profile).Error
}

func (r *profileRepo) UpdateSocialLinks(ctx context.Context, profileID uint, links []domain.SocialLink) error {
	tx := r.db.WithContext(ctx).Begin()
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
