// internal/handlers/experience_handler.go
package handlers

import (
	"backend-portofolio/internal/db"
	"backend-portofolio/internal/models"
	"github.com/gin-gonic/gin"
	"net/http"
)

// PUBLIC
func ListPublicExperiences() gin.HandlerFunc {
	return func(c *gin.Context) {
		var items []models.Experience
		db.Conn.Order("sort_order asc, start_date desc").Find(&items)
		c.JSON(http.StatusOK, items)
	}
}

// ADMIN
func AdminListExperiences() gin.HandlerFunc {
	return func(c *gin.Context) {
		var items []models.Experience
		db.Conn.Order("sort_order asc, start_date desc").Find(&items)
		c.JSON(http.StatusOK, items)
	}
}

func CreateExperience() gin.HandlerFunc {
	return func(c *gin.Context) {
		var item models.Experience
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

func UpdateExperience() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var item models.Experience
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

func DeleteExperience() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if err := db.Conn.Delete(&models.Experience{}, id).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "delete error"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"ok": true})
	}
}
