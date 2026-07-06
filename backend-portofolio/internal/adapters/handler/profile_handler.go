package handler

import (
	"backend-portofolio/internal/core/domain"
	"backend-portofolio/internal/core/ports"
	"backend-portofolio/internal/dto"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ProfileHandler struct {
	svc ports.ProfileService
}

func NewProfileHandler(svc ports.ProfileService) *ProfileHandler {
	return &ProfileHandler{svc: svc}
}

func (h *ProfileHandler) GetPublic(c *gin.Context) {
	p, err := h.svc.GetPublicProfile(c.Request.Context())
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusOK, domain.Profile{})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal error"})
		return
	}
	c.JSON(http.StatusOK, p)
}

func (h *ProfileHandler) Upsert(c *gin.Context) {
	var req dto.ProfileReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload: " + err.Error()})
		return
	}

	profile := domain.Profile{
		FullName:        req.FullName,
		Headline:        req.Headline,
		Bio:             req.Bio,
		PhotoURL:        req.PhotoURL,
		Location:        req.Location,
		ResumeURL:       req.ResumeURL,
		SkillGroupOrder: req.SkillGroupOrder,
	}

	var socials []domain.SocialLink
	for _, s := range req.Socials {
		socials = append(socials, domain.SocialLink{
			Name:   s.Name,
			URL:    s.URL,
			Icon:   s.Icon,
			Active: s.Active,
		})
	}

	if err := h.svc.UpdateProfile(c.Request.Context(), profile, socials); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}
