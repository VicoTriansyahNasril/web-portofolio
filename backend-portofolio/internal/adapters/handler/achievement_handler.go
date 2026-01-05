package handler

import (
	"backend-portofolio/internal/core/ports"
	"backend-portofolio/internal/dto"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type AchievementHandler struct {
	svc ports.AchievementService
}

func NewAchievementHandler(svc ports.AchievementService) *AchievementHandler {
	return &AchievementHandler{svc: svc}
}

func (h *AchievementHandler) ListPublic(c *gin.Context) {
	items, err := h.svc.GetPublicAchievements()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal error"})
		return
	}
	c.JSON(http.StatusOK, items)
}

func (h *AchievementHandler) ListAdmin(c *gin.Context) {
	items, err := h.svc.GetAdminAchievements()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal error"})
		return
	}
	c.JSON(http.StatusOK, items)
}

func (h *AchievementHandler) Create(c *gin.Context) {
	var req dto.AchievementReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
		return
	}
	if err := h.svc.CreateAchievement(req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "achievement created"})
}

func (h *AchievementHandler) Update(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	var req dto.AchievementReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
		return
	}
	if err := h.svc.UpdateAchievement(uint(id), req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "achievement updated"})
}

func (h *AchievementHandler) Delete(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	if err := h.svc.DeleteAchievement(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "achievement deleted"})
}

func (h *AchievementHandler) Reorder(c *gin.Context) {
	var req struct {
		Orders []struct {
			ID        uint `json:"id"`
			SortOrder int  `json:"sort_order"`
		} `json:"orders"`
	}
	if err := c.ShouldBindJSON(&req); err != nil || len(req.Orders) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid body"})
		return
	}
	if err := h.svc.ReorderAchievements(req.Orders); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "achievements reordered"})
}
