package handlers

import (
	"backend-portofolio/internal/cache"
	"backend-portofolio/internal/db"
	"backend-portofolio/internal/models"
	"backend-portofolio/internal/websocket"
	"database/sql"
	"encoding/json"
	"net/http"
	"regexp"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

const publicProjectsCacheKey = "public_projects"

func invalidateProjectCache(slug string) {
	cache.DelByPattern("project*")
	hub := websocket.GetHub()
	hub.BroadcastEvent("change", "/api/projects")
	if slug != "" {
		hub.BroadcastEvent("change", "/api/projects/"+slug)
	}
}

func fromGalleryJSON(s string) []string {
	if s == "" {
		return []string{}
	}
	var out []string
	_ = json.Unmarshal([]byte(s), &out)
	return out
}

func toGalleryJSON(arr []string) string {
	b, _ := json.Marshal(arr)
	return string(b)
}

var nonAlnum = regexp.MustCompile(`[^a-z0-9]+`)

func normSlug(s string) string {
	s = strings.ToLower(strings.TrimSpace(s))
	s = nonAlnum.ReplaceAllString(s, "-")
	s = strings.Trim(s, "-")
	if len(s) > 120 {
		s = s[:120]
	}
	return s
}

func ListPublicProjects() gin.HandlerFunc {
	return func(c *gin.Context) {
		cached, err := cache.Get(publicProjectsCacheKey)
		if err == nil {
			c.Header("Content-Type", "application/json; charset=utf-8")
			c.String(http.StatusOK, cached)
			return
		}

		var items []models.Project
		db.Conn.Where("status = ?", "published").Order("CASE WHEN sort_order IS NULL THEN 1 ELSE 0 END, sort_order ASC, created_at DESC").Find(&items)
		resp := make([]gin.H, 0, len(items))
		for _, p := range items {
			resp = append(resp, gin.H{
				"id": p.ID, "slug": p.Slug, "title": p.Title, "summary": p.Summary,
				"cover_url": p.CoverURL, "repo_url": p.RepoURL, "demo_url": p.DemoURL,
				"role": p.Role, "status": p.Status, "is_featured": p.IsFeatured,
				"gallery": fromGalleryJSON(p.GalleryJSON), "sort_order": p.SortOrder,
				"created_at": p.CreatedAt, "updated_at": p.UpdatedAt, "tech_stack": p.TechStack,
			})
		}

		jsonData, _ := json.Marshal(resp)
		cache.Set(publicProjectsCacheKey, jsonData, 5*time.Minute)
		c.JSON(http.StatusOK, resp)
	}
}

func GetProjectBySlug() gin.HandlerFunc {
	return func(c *gin.Context) {
		slug := normSlug(c.Param("slug"))
		cacheKey := "project_" + slug
		cached, err := cache.Get(cacheKey)
		if err == nil {
			c.Header("Content-Type", "application/json; charset=utf-8")
			c.String(http.StatusOK, cached)
			return
		}

		var p models.Project
		if err := db.Conn.Where("slug = ? AND status = ?", slug, "published").First(&p).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": "query error"})
			return
		}
		resp := gin.H{
			"id": p.ID, "slug": p.Slug, "title": p.Title, "summary": p.Summary,
			"body": p.Body, "cover_url": p.CoverURL, "repo_url": p.RepoURL,
			"demo_url": p.DemoURL, "role": p.Role, "status": p.Status,
			"is_featured": p.IsFeatured, "gallery": fromGalleryJSON(p.GalleryJSON),
			"sort_order": p.SortOrder, "created_at": p.CreatedAt, "updated_at": p.UpdatedAt,
			"tech_stack": p.TechStack,
		}

		jsonData, _ := json.Marshal(resp)
		cache.Set(cacheKey, jsonData, 5*time.Minute)
		c.JSON(http.StatusOK, resp)
	}
}

func AdminListProjects() gin.HandlerFunc {
	return func(c *gin.Context) {
		var items []models.Project
		db.Conn.Order("CASE WHEN sort_order IS NULL THEN 1 ELSE 0 END, sort_order ASC, created_at DESC").Find(&items)
		resp := make([]gin.H, 0, len(items))
		for _, p := range items {
			resp = append(resp, gin.H{
				"id": p.ID, "slug": p.Slug, "title": p.Title, "summary": p.Summary,
				"body": p.Body, "cover_url": p.CoverURL, "repo_url": p.RepoURL,
				"demo_url": p.DemoURL, "role": p.Role, "status": p.Status,
				"is_featured": p.IsFeatured, "gallery": fromGalleryJSON(p.GalleryJSON),
				"sort_order": p.SortOrder, "created_at": p.CreatedAt, "updated_at": p.UpdatedAt,
				"tech_stack": p.TechStack,
			})
		}
		c.JSON(http.StatusOK, resp)
	}
}

type createProjectReq struct {
	Slug       string   `json:"slug" binding:"required"`
	Title      string   `json:"title" binding:"required"`
	Summary    string   `json:"summary" binding:"required"`
	Body       string   `json:"body"`
	CoverURL   string   `json:"cover_url"`
	RepoURL    string   `json:"repo_url"`
	DemoURL    string   `json:"demo_url"`
	Role       string   `json:"role"`
	Status     string   `json:"status"`
	IsFeatured bool     `json:"is_featured"`
	Gallery    []string `json:"gallery"`
	TechStack  string   `json:"tech_stack"`
}

func CreateProject() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req createProjectReq
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid body"})
			return
		}

		var max sql.NullInt64
		row := db.Conn.Model(&models.Project{}).Select("MAX(sort_order)").Row()
		_ = row.Scan(&max)
		next := 0
		if max.Valid {
			next = int(max.Int64) + 1
		}

		now := time.Now()
		p := models.Project{
			Slug:        normSlug(req.Slug),
			Title:       strings.TrimSpace(req.Title),
			Summary:     strings.TrimSpace(req.Summary),
			Body:        req.Body,
			CoverURL:    strings.TrimSpace(req.CoverURL),
			RepoURL:     strings.TrimSpace(req.RepoURL),
			DemoURL:     strings.TrimSpace(req.DemoURL),
			Role:        strings.TrimSpace(req.Role),
			Status:      strings.TrimSpace(req.Status),
			IsFeatured:  req.IsFeatured,
			GalleryJSON: toGalleryJSON(req.Gallery),
			SortOrder:   &next,
			CreatedAt:   now,
			UpdatedAt:   now,
			TechStack:   req.TechStack,
		}
		if p.Status == "" {
			p.Status = "published"
		}

		if err := db.Conn.Create(&p).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "insert error"})
			return
		}

		invalidateProjectCache("")
		c.JSON(http.StatusCreated, p)
	}
}

type updateProjectReq struct {
	Slug       *string   `json:"slug"`
	Title      *string   `json:"title"`
	Summary    *string   `json:"summary"`
	Body       *string   `json:"body"`
	CoverURL   *string   `json:"cover_url"`
	RepoURL    *string   `json:"repo_url"`
	DemoURL    *string   `json:"demo_url"`
	Role       *string   `json:"role"`
	Status     *string   `json:"status"`
	IsFeatured *bool     `json:"is_featured"`
	Gallery    *[]string `json:"gallery"`
	SortOrder  *int      `json:"sort_order"`
	TechStack  *string   `json:"tech_stack"`
}

func UpdateProject() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var p models.Project
		if err := db.Conn.First(&p, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
			return
		}

		var req updateProjectReq
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid body"})
			return
		}

		if req.Slug != nil {
			p.Slug = normSlug(*req.Slug)
		}
		if req.Title != nil {
			p.Title = strings.TrimSpace(*req.Title)
		}
		if req.Summary != nil {
			p.Summary = strings.TrimSpace(*req.Summary)
		}
		if req.Body != nil {
			p.Body = *req.Body
		}
		if req.CoverURL != nil {
			p.CoverURL = strings.TrimSpace(*req.CoverURL)
		}
		if req.RepoURL != nil {
			p.RepoURL = strings.TrimSpace(*req.RepoURL)
		}
		if req.DemoURL != nil {
			p.DemoURL = strings.TrimSpace(*req.DemoURL)
		}
		if req.Role != nil {
			p.Role = strings.TrimSpace(*req.Role)
		}
		if req.Status != nil {
			p.Status = strings.TrimSpace(*req.Status)
		}
		if req.IsFeatured != nil {
			p.IsFeatured = *req.IsFeatured
		}
		if req.Gallery != nil {
			p.GalleryJSON = toGalleryJSON(*req.Gallery)
		}
		if req.SortOrder != nil {
			p.SortOrder = req.SortOrder
		}
		if req.TechStack != nil {
			p.TechStack = *req.TechStack
		}
		p.UpdatedAt = time.Now()

		if err := db.Conn.Save(&p).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		invalidateProjectCache(p.Slug)
		c.JSON(http.StatusOK, gin.H{"ok": true})
	}
}

func DeleteProject() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if err := db.Conn.Delete(&models.Project{}, id).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "delete error"})
			return
		}
		invalidateProjectCache("")
		c.JSON(http.StatusOK, gin.H{"ok": true})
	}
}

type reorderReq struct {
	Orders []struct {
		ID        uint `json:"id"`
		SortOrder int  `json:"sort_order"`
	} `json:"orders"`
}

func ReorderProjects() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req reorderReq
		if err := c.ShouldBindJSON(&req); err != nil || len(req.Orders) == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid body"})
			return
		}

		tx := db.Conn.Begin()
		now := time.Now()
		for _, o := range req.Orders {
			v := o.SortOrder
			if err := tx.Model(&models.Project{}).Where("id = ?", o.ID).Updates(map[string]any{"sort_order": &v, "updated_at": now}).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "update error"})
				return
			}
		}
		if err := tx.Commit().Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "commit error"})
			return
		}
		invalidateProjectCache("")
		c.JSON(http.StatusOK, gin.H{"ok": true})
	}
}
