package handlers

import (
	"backend-portofolio/internal/cache"
	"backend-portofolio/internal/db"
	"backend-portofolio/internal/models"
	"backend-portofolio/internal/websocket"
	"encoding/json"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

const publicProfileCacheKey = "public_profile"

func invalidateProfileCache() {
	cache.DelByPattern(publicProfileCacheKey + "*")
	hub := websocket.GetHub()
	hub.BroadcastEvent("change", "/api/profile")
}

func GetProfilePublic() gin.HandlerFunc {
	return func(c *gin.Context) {
		cached, err := cache.Get(publicProfileCacheKey)
		if err == nil {
			c.Header("Content-Type", "application/json; charset=utf-8")
			c.String(http.StatusOK, cached)
			return
		}

		var p models.Profile
		db.Conn.Preload("Socials").First(&p)

		jsonData, _ := json.Marshal(p)
		cache.Set(publicProfileCacheKey, jsonData, 5*time.Minute)
		c.JSON(http.StatusOK, p)
	}
}

type upsertProfileReq struct {
	FullName        string              `json:"full_name"`
	Headline        string              `json:"headline"`
	Bio             string              `json:"bio"`
	PhotoURL        string              `json:"photo_url"`
	Location        string              `json:"location"`
	ResumeURL       string              `json:"resume_url"`
	SkillGroupOrder string              `json:"skill_group_order"`
	Socials         []models.SocialLink `json:"socials"`
}

func UpsertProfile() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req upsertProfileReq
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
			return
		}

		tx := db.Conn.Begin()

		var p models.Profile
		err := tx.First(&p).Error
		if err != nil && err != gorm.ErrRecordNotFound {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "database error on finding profile"})
			return
		}

		p.FullName = req.FullName
		p.Headline = req.Headline
		p.Bio = req.Bio
		p.PhotoURL = req.PhotoURL
		p.Location = req.Location
		p.ResumeURL = req.ResumeURL
		p.SkillGroupOrder = req.SkillGroupOrder

		if err := tx.Save(&p).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "save profile error"})
			return
		}

		if err := tx.Where("profile_id = ?", p.ID).Delete(&models.SocialLink{}).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "delete social links error"})
			return
		}

		if len(req.Socials) > 0 {
			for i := range req.Socials {
				req.Socials[i].ProfileID = p.ID
			}
			if err := tx.Create(&req.Socials).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "create social links error"})
				return
			}
		}

		if err := tx.Commit().Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "commit error"})
			return
		}

		db.Conn.Preload("Socials").First(&p, p.ID)
		invalidateProfileCache()
		c.JSON(http.StatusOK, p)
	}
}
