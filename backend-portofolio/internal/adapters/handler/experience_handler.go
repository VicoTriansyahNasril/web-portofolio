package handler

import (
	"backend-portofolio/internal/core/ports"
	"backend-portofolio/internal/dto"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ExperienceHandler struct {
	svc ports.ExperienceService
}

func NewExperienceHandler(svc ports.ExperienceService) *ExperienceHandler {
	return &ExperienceHandler{svc: svc}
}

func (h *ExperienceHandler) ListPublic(c *gin.Context) {
	items, err := h.svc.GetPublicExperiences(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal error"})
		return
	}
	c.JSON(http.StatusOK, items)
}

func (h *ExperienceHandler) ListAdmin(c *gin.Context) {
	items, err := h.svc.GetAdminExperiences(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal error"})
		return
	}
	c.JSON(http.StatusOK, items)
}

func (h *ExperienceHandler) Create(c *gin.Context) {
	var req dto.ExperienceReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
		return
	}
	if err := h.svc.CreateExperience(c.Request.Context(), req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "experience created"})
}

func (h *ExperienceHandler) Update(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	var req dto.ExperienceReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
		return
	}
	if err := h.svc.UpdateExperience(c.Request.Context(), uint(id), req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "experience updated"})
}

func (h *ExperienceHandler) Delete(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	if err := h.svc.DeleteExperience(c.Request.Context(), uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "experience deleted"})
}
