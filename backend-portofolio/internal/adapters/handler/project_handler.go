package handler

import (
	"backend-portofolio/internal/cache"
	"backend-portofolio/internal/core/ports"
	"backend-portofolio/internal/dto"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ProjectHandler struct {
	svc ports.ProjectService
}

func NewProjectHandler(svc ports.ProjectService) *ProjectHandler {
	return &ProjectHandler{svc: svc}
}

func fromGalleryJSON(s string) []string {
	if s == "" {
		return []string{}
	}
	var out []string
	_ = json.Unmarshal([]byte(s), &out)
	return out
}

func (h *ProjectHandler) ListPublic(c *gin.Context) {
	const cacheKey = "public_projects"
	cached, err := cache.Get(cacheKey)
	if err == nil {
		c.Header("Content-Type", "application/json; charset=utf-8")
		c.String(http.StatusOK, cached)
		return
	}

	items, err := h.svc.GetPublicList(c.Request.Context())
	if err != nil {
		log.Printf("[ProjectHandler] ListPublic Error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal error"})
		return
	}

	resp := make([]gin.H, 0, len(items))
	for _, p := range items {
		resp = append(resp, gin.H{
			"id":          p.ID,
			"slug":        p.Slug,
			"title":       p.Title,
			"summary":     p.Summary,
			"cover_url":   p.CoverURL,
			"repo_url":    p.RepoURL,
			"demo_url":    p.DemoURL,
			"role":        p.Role,
			"status":      p.Status,
			"is_featured": p.IsFeatured,
			"gallery":     fromGalleryJSON(p.GalleryJSON),
			"sort_order":  p.SortOrder,
			"created_at":  p.CreatedAt,
			"updated_at":  p.UpdatedAt,
			"tech_stack":  p.TechStack,
			"start_date":  p.StartDate,
			"end_date":    p.EndDate,
		})
	}

	jsonData, _ := json.Marshal(resp)
	cache.Set(cacheKey, jsonData, 5*time.Minute)
	c.JSON(http.StatusOK, resp)
}

func (h *ProjectHandler) GetBySlug(c *gin.Context) {
	slug := c.Param("slug")
	cacheKey := "project_" + slug
	cached, err := cache.Get(cacheKey)
	if err == nil {
		c.Header("Content-Type", "application/json; charset=utf-8")
		c.String(http.StatusOK, cached)
		return
	}

	p, err := h.svc.GetPublicBySlug(c.Request.Context(), slug)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	resp := gin.H{
		"id":          p.ID,
		"slug":        p.Slug,
		"title":       p.Title,
		"summary":     p.Summary,
		"body":        p.Body,
		"cover_url":   p.CoverURL,
		"repo_url":    p.RepoURL,
		"demo_url":    p.DemoURL,
		"role":        p.Role,
		"status":      p.Status,
		"is_featured": p.IsFeatured,
		"gallery":     fromGalleryJSON(p.GalleryJSON),
		"sort_order":  p.SortOrder,
		"created_at":  p.CreatedAt,
		"updated_at":  p.UpdatedAt,
		"tech_stack":  p.TechStack,
		"start_date":  p.StartDate,
		"end_date":    p.EndDate,
	}

	jsonData, _ := json.Marshal(resp)
	cache.Set(cacheKey, jsonData, 5*time.Minute)
	c.JSON(http.StatusOK, resp)
}

func (h *ProjectHandler) AdminList(c *gin.Context) {
	items, err := h.svc.GetAdminList(c.Request.Context())
	if err != nil {
		log.Printf("[ProjectHandler] AdminList Error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db error"})
		return
	}

	resp := make([]gin.H, 0, len(items))
	for _, p := range items {
		resp = append(resp, gin.H{
			"id":          p.ID,
			"slug":        p.Slug,
			"title":       p.Title,
			"summary":     p.Summary,
			"body":        p.Body,
			"cover_url":   p.CoverURL,
			"repo_url":    p.RepoURL,
			"demo_url":    p.DemoURL,
			"role":        p.Role,
			"status":      p.Status,
			"is_featured": p.IsFeatured,
			"gallery":     fromGalleryJSON(p.GalleryJSON),
			"sort_order":  p.SortOrder,
			"created_at":  p.CreatedAt,
			"updated_at":  p.UpdatedAt,
			"tech_stack":  p.TechStack,
			"start_date":  p.StartDate,
			"end_date":    p.EndDate,
		})
	}
	c.JSON(http.StatusOK, resp)
}

func (h *ProjectHandler) GetAdminByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	p, err := h.svc.GetAdminByID(c.Request.Context(), uint(id))
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
			return
		}
		log.Printf("[ProjectHandler] GetAdminByID Error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db error"})
		return
	}

	resp := gin.H{
		"id":          p.ID,
		"slug":        p.Slug,
		"title":       p.Title,
		"summary":     p.Summary,
		"body":        p.Body,
		"cover_url":   p.CoverURL,
		"repo_url":    p.RepoURL,
		"demo_url":    p.DemoURL,
		"role":        p.Role,
		"status":      p.Status,
		"is_featured": p.IsFeatured,
		"gallery":     fromGalleryJSON(p.GalleryJSON),
		"sort_order":  p.SortOrder,
		"created_at":  p.CreatedAt,
		"updated_at":  p.UpdatedAt,
		"tech_stack":  p.TechStack,
		"start_date":  p.StartDate,
		"end_date":    p.EndDate,
	}
	c.JSON(http.StatusOK, resp)
}

func (h *ProjectHandler) Create(c *gin.Context) {
	var req dto.CreateProjectReq
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("[ProjectHandler] BindJSON Error: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid body"})
		return
	}

	p, err := h.svc.CreateProject(c.Request.Context(), req)
	if err != nil {
		log.Printf("[ProjectHandler] CreateProject Error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, p)
}

func (h *ProjectHandler) Update(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var req dto.UpdateProjectReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid body"})
		return
	}

	if err := h.svc.UpdateProject(c.Request.Context(), uint(id), req); err != nil {
		log.Printf("[ProjectHandler] UpdateProject Error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *ProjectHandler) Delete(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	if err := h.svc.DeleteProject(c.Request.Context(), uint(id)); err != nil {
		log.Printf("[ProjectHandler] DeleteProject Error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "delete error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *ProjectHandler) Reorder(c *gin.Context) {
	var req dto.ReorderReq
	if err := c.ShouldBindJSON(&req); err != nil || len(req.Orders) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid body"})
		return
	}

	if err := h.svc.ReorderProjects(c.Request.Context(), req); err != nil {
		log.Printf("[ProjectHandler] ReorderProjects Error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}
