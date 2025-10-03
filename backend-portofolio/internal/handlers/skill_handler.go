// internal/handlers/skill_handler.go
package handlers

import (
	"net/http"
	"time"

	"backend-portofolio/internal/db"
	"backend-portofolio/internal/models"
	"github.com/gin-gonic/gin"
)

// PUBLIC
func GetSkillsPublic() gin.HandlerFunc {
	return func(c *gin.Context) {
		var items []models.Skill
		if err := db.Conn.Order(`sort_order asc, "group" asc, name asc`).Find(&items).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "query error"})
			return
		}
		c.JSON(http.StatusOK, items)
	}
}

// ADMIN
func AdminListSkills() gin.HandlerFunc {
	return func(c *gin.Context) {
		var items []models.Skill
		if err := db.Conn.Order("sort_order asc").Find(&items).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "query error"})
			return
		}
		c.JSON(http.StatusOK, items)
	}
}

type reorderSkillItem struct {
	ID        uint `json:"id"`
	SortOrder int  `json:"sort_order"`
}
type reorderSkillReq struct {
	Orders []reorderSkillItem `json:"orders"`
}

func ReorderSkills() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req reorderSkillReq
		if err := c.ShouldBindJSON(&req); err != nil || len(req.Orders) == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid body"})
			return
		}

		tx := db.Conn.Begin()
		for _, o := range req.Orders {
			if err := tx.Model(&models.Skill{}).
				Where("id = ?", o.ID).
				Updates(map[string]interface{}{"sort_order": o.SortOrder, "updated_at": time.Now()}).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "update error: " + err.Error()})
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

// Create, Update, Delete
func CreateSkill() gin.HandlerFunc {
	return func(c *gin.Context) {
		var s models.Skill
		if err := c.ShouldBindJSON(&s); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
			return
		}
		if err := db.Conn.Create(&s).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "create error"})
			return
		}
		c.JSON(http.StatusCreated, s)
	}
}

func UpdateSkill() gin.HandlerFunc {
	return func(c *gin.Context) {
		var s models.Skill
		id := c.Param("id")
		if err := db.Conn.First(&s, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
			return
		}
		var in models.Skill
		if err := c.ShouldBindJSON(&in); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
			return
		}
		s.Group = in.Group
		s.Name = in.Name
		if err := db.Conn.Save(&s).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "update error"})
			return
		}
		c.JSON(http.StatusOK, s)
	}
}

func DeleteSkill() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if err := db.Conn.Delete(&models.Skill{}, id).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "delete error"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"ok": true})
	}
}
