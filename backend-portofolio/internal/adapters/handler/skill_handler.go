package handler

import (
	"backend-portofolio/internal/core/domain"
	"backend-portofolio/internal/core/ports"
	"backend-portofolio/internal/dto"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type SkillHandler struct {
	svc ports.SkillService
}

func NewSkillHandler(svc ports.SkillService) *SkillHandler {
	return &SkillHandler{svc: svc}
}

func (h *SkillHandler) ListPublic(c *gin.Context) {
	items, err := h.svc.GetPublicSkills()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal error"})
		return
	}
	c.JSON(http.StatusOK, items)
}

func (h *SkillHandler) ListAdmin(c *gin.Context) {
	items, err := h.svc.GetAdminSkills()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal error"})
		return
	}
	c.JSON(http.StatusOK, items)
}

func (h *SkillHandler) Create(c *gin.Context) {
	var req dto.SkillReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
		return
	}

	skill := domain.Skill{
		Group: req.Group,
		Name:  req.Name,
	}

	if err := h.svc.CreateSkill(skill); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, skill)
}

func (h *SkillHandler) Update(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	var req dto.SkillReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
		return
	}

	skill := domain.Skill{
		Group: req.Group,
		Name:  req.Name,
	}

	if err := h.svc.UpdateSkill(uint(id), skill); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, skill)
}

func (h *SkillHandler) Delete(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	if err := h.svc.DeleteSkill(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *SkillHandler) Reorder(c *gin.Context) {
	var req dto.ReorderReq
	if err := c.ShouldBindJSON(&req); err != nil || len(req.Orders) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid body"})
		return
	}

	var serviceOrders []struct {
		ID        uint `json:"id"`
		SortOrder int  `json:"sort_order"`
	}
	for _, o := range req.Orders {
		serviceOrders = append(serviceOrders, struct {
			ID        uint `json:"id"`
			SortOrder int  `json:"sort_order"`
		}{
			ID:        o.ID,
			SortOrder: o.SortOrder,
		})
	}

	if err := h.svc.ReorderSkills(serviceOrders); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}
