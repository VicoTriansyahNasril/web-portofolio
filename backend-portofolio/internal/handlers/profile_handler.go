package handlers

import (
	"net/http"

	"backend-portofolio/internal/db"
	"backend-portofolio/internal/models"
	"github.com/gin-gonic/gin"
)

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

func GetProfilePublic() gin.HandlerFunc {
	return func(c *gin.Context) {
		var p models.Profile
		if err := db.Conn.Preload("Socials", "active = ?", true).First(&p).Error; err != nil {
			c.JSON(http.StatusOK, gin.H{"profile": nil})
			return
		}
		c.JSON(http.StatusOK, p)
	}
}

func UpsertProfile() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req upsertProfileReq
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
			return
		}

		var p models.Profile
		db.Conn.First(&p)

		p.FullName = req.FullName
		p.Headline = req.Headline
		p.Bio = req.Bio
		p.PhotoURL = req.PhotoURL
		p.Location = req.Location
		p.ResumeURL = req.ResumeURL
		p.SkillGroupOrder = req.SkillGroupOrder

		if p.ID == 0 {
			if err := db.Conn.Create(&p).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "create error"})
				return
			}
		} else {
			if err := db.Conn.Save(&p).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "save error"})
				return
			}
		}

		db.Conn.Where("profile_id = ?", p.ID).Delete(&models.SocialLink{})
		if len(req.Socials) > 0 {
			for i := range req.Socials {
				req.Socials[i].ProfileID = p.ID
			}
			if err := db.Conn.Create(&req.Socials).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "create socials error"})
				return
			}
		}

		p.Socials = req.Socials
		c.JSON(http.StatusOK, p)
	}
}
