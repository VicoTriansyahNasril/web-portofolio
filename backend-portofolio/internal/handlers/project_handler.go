package handlers

import (
	"backend-portofolio/internal/cache"
	"backend-portofolio/internal/dto"
	"backend-portofolio/internal/services"
	"encoding/json"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

var projectService = services.ProjectService{}

func fromGalleryJSON(s string) []string {
	if s == "" {
		return []string{}
	}
	var out []string
	_ = json.Unmarshal([]byte(s), &out)
	return out
}

func ListPublicProjects() gin.HandlerFunc {
	return func(c *gin.Context) {
		const cacheKey = "public_projects"
		cached, err := cache.Get(cacheKey)
		if err == nil {
			c.Header("Content-Type", "application/json; charset=utf-8")
			c.String(http.StatusOK, cached)
			return
		}

		items, err := projectService.GetAllPublic()
		if err != nil {
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
}

func GetProjectBySlug() gin.HandlerFunc {
	return func(c *gin.Context) {
		slug := c.Param("slug")
		cacheKey := "project_" + slug
		cached, err := cache.Get(cacheKey)
		if err == nil {
			c.Header("Content-Type", "application/json; charset=utf-8")
			c.String(http.StatusOK, cached)
			return
		}

		p, err := projectService.GetPublicBySlug(slug)
		if err != nil {
			if err == gorm.ErrRecordNotFound {
				c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": "query error"})
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
}

func AdminListProjects() gin.HandlerFunc {
	return func(c *gin.Context) {
		items, err := projectService.GetAllAdmin()
		if err != nil {
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
}

func GetAdminProject() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		p, err := projectService.GetAdminByID(id)
		if err != nil {
			if err == gorm.ErrRecordNotFound {
				c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
				return
			}
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
}

func CreateProject() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req dto.CreateProjectReq
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid body"})
			return
		}

		p, err := projectService.Create(req)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusCreated, p)
	}
}

func UpdateProject() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var req dto.UpdateProjectReq
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid body"})
			return
		}

		if err := projectService.Update(id, req); err != nil {
			if err == gorm.ErrRecordNotFound {
				c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"ok": true})
	}
}

func DeleteProject() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if err := projectService.Delete(id); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "delete error"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"ok": true})
	}
}

func ReorderProjects() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req dto.ReorderProjectReq
		if err := c.ShouldBindJSON(&req); err != nil || len(req.Orders) == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid body"})
			return
		}

		if err := projectService.Reorder(req); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"ok": true})
	}
}
