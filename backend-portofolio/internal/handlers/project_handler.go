// internal/handlers/project_handler.go
package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"regexp"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"backend-portofolio/internal/db"
	"backend-portofolio/internal/models"
)

// ---- utils ----
func fromGalleryJSON(s string) []string {
	if s == "" {
		return []string{}
	}
	var out []string
	_ = json.Unmarshal([]byte(s), &out)
	return out
}
func toGalleryJSON(arr []string) string { b, _ := json.Marshal(arr); return string(b) }

// normalisasi slug ke kebab-case
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

// ====== PUBLIC ======
func ListPublicProjects() gin.HandlerFunc {
	return func(c *gin.Context) {
		var items []models.Project
		if err := db.Conn.
			Where("status = ?", "published").
			Order("CASE WHEN sort_order IS NULL THEN 1 ELSE 0 END, sort_order ASC, created_at DESC").
			Find(&items).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "query error"})
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
			})
		}
		c.JSON(http.StatusOK, resp)
	}
}

func GetProjectBySlug() gin.HandlerFunc {
	return func(c *gin.Context) {
		slug := normSlug(c.Param("slug"))
		var p models.Project
		if err := db.Conn.Where("slug = ? AND status = ?", slug, "published").First(&p).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": "query error"})
			return
		}
		c.JSON(http.StatusOK, gin.H{
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
		})
	}
}

// ====== ADMIN ======
func AdminListProjects() gin.HandlerFunc {
	return func(c *gin.Context) {
		var items []models.Project
		if err := db.Conn.
			Order("CASE WHEN sort_order IS NULL THEN 1 ELSE 0 END, sort_order ASC, created_at DESC").
			Find(&items).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "query error"})
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
			Slug:        strings.TrimSpace(req.Slug),
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
			low := strings.ToLower(err.Error())
			if strings.Contains(low, "duplicate") || strings.Contains(low, "unique") {
				c.JSON(http.StatusConflict, gin.H{"error": "slug already exists"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": "insert error"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{
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
		})
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
			if err == gorm.ErrRecordNotFound {
				c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": "query error"})
			return
		}
		var req updateProjectReq
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid body"})
			return
		}

		if req.Slug != nil {
			ns := normSlug(*req.Slug)
			if ns == "" {
				c.JSON(http.StatusBadRequest, gin.H{"error": "invalid slug"})
				return
			}
			p.Slug = ns
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
			low := strings.ToLower(err.Error())
			if strings.Contains(low, "duplicate") || strings.Contains(low, "unique") {
				c.JSON(http.StatusConflict, gin.H{"error": "slug already exists"})
				return
			}
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"ok": true})
	}
}

type reorderItem struct {
	ID        uint `json:"id"`
	SortOrder int  `json:"sort_order"`
}
type reorderReq struct {
	Orders []reorderItem `json:"orders"`
}

func DeleteProject() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if err := db.Conn.Delete(&models.Project{}, id).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "delete error"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"ok": true})
	}
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
			if err := tx.Model(&models.Project{}).
				Where("id = ?", o.ID).
				Updates(map[string]any{"sort_order": &v, "updated_at": now}).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "update error"})
				return
			}
		}
		if err := tx.Commit().Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "commit error"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"ok": true})
	}
}
