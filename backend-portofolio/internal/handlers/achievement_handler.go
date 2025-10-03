// internal/handlers/achievement_handler.go
package handlers

import (
	"backend-portofolio/internal/db"
	"backend-portofolio/internal/models"
	"github.com/gin-gonic/gin"
	"net/http"
	"time"
)

// PUBLIC
func ListPublicAchievements() gin.HandlerFunc {
	return func(c *gin.Context) {
		var items []models.Achievement
		db.Conn.Order("sort_order asc, date desc").Find(&items)
		c.JSON(http.StatusOK, items)
	}
}

// ADMIN
func AdminListAchievements() gin.HandlerFunc {
	return func(c *gin.Context) {
		var items []models.Achievement
		db.Conn.Order("sort_order asc, date desc").Find(&items)
		c.JSON(http.StatusOK, items)
	}
}

func CreateAchievement() gin.HandlerFunc {
	return func(c *gin.Context) {
		var item models.Achievement
		if err := c.ShouldBindJSON(&item); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
			return
		}
		if err := db.Conn.Create(&item).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "create error"})
			return
		}
		c.JSON(http.StatusCreated, item)
	}
}

func UpdateAchievement() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var item models.Achievement
		if err := db.Conn.First(&item, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
			return
		}
		if err := c.ShouldBindJSON(&item); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
			return
		}
		if err := db.Conn.Save(&item).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "update error"})
			return
		}
		c.JSON(http.StatusOK, item)
	}
}

func DeleteAchievement() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if err := db.Conn.Delete(&models.Achievement{}, id).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "delete error"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"ok": true})
	}
}

type reorderAchievementItem struct {
	ID        uint `json:"id"`
	SortOrder int  `json:"sort_order"`
}
type reorderAchievementReq struct {
	Orders []reorderAchievementItem `json:"orders"`
}

func ReorderAchievements() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req reorderAchievementReq
		if err := c.ShouldBindJSON(&req); err != nil || len(req.Orders) == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid body"})
			return
		}

		tx := db.Conn.Begin()
		now := time.Now()
		for _, o := range req.Orders {
			if err := tx.Model(&models.Achievement{}).
				Where("id = ?", o.ID).
				Updates(map[string]any{"sort_order": o.SortOrder, "updated_at": now}).Error; err != nil {
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
