package handlers

import (
	"backend-portofolio/internal/cache"
	"backend-portofolio/internal/db"
	"backend-portofolio/internal/models"
	"backend-portofolio/internal/websocket"
	"encoding/json"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func invalidateExperienceCache() {
	cache.DelByPattern("public_experiences*")
	websocket.GetHub().BroadcastEvent("change", "/api/experiences")
}

type experiencePayload struct {
	Type        string  `json:"type" binding:"required"`
	Title       string  `json:"title" binding:"required"`
	EntityName  string  `json:"entity_name" binding:"required"`
	Location    string  `json:"location"`
	Description string  `json:"description"`
	StartDate   string  `json:"start_date" binding:"required"`
	EndDate     *string `json:"end_date"`
	SortOrder   int     `json:"sort_order"`
}

func ListPublicExperiences() gin.HandlerFunc {
	return func(c *gin.Context) {
		const cacheKey = "public_experiences"
		cached, err := cache.Get(cacheKey)
		if err == nil {
			c.Header("Content-Type", "application/json; charset=utf-8")
			c.String(http.StatusOK, cached)
			return
		}

		items := make([]models.Experience, 0)
		db.Conn.Order("sort_order asc, start_date desc").Find(&items)

		jsonData, _ := json.Marshal(items)
		cache.Set(cacheKey, jsonData, 5*time.Minute)

		c.JSON(http.StatusOK, items)
	}
}

func AdminListExperiences() gin.HandlerFunc {
	return func(c *gin.Context) {
		var items []models.Experience
		db.Conn.Order("sort_order asc, start_date desc").Find(&items)
		c.JSON(http.StatusOK, items)
	}
}

func CreateExperience() gin.HandlerFunc {
	return func(c *gin.Context) {
		var payload experiencePayload
		if err := c.ShouldBindJSON(&payload); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload: " + err.Error()})
			return
		}

		startDate, err := time.Parse(time.RFC3339, payload.StartDate)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid start_date format"})
			return
		}

		var endDate *time.Time
		if payload.EndDate != nil && *payload.EndDate != "" {
			t, err := time.Parse(time.RFC3339, *payload.EndDate)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "invalid end_date format"})
				return
			}
			endDate = &t
		}

		item := models.Experience{
			Type:        payload.Type,
			Title:       payload.Title,
			EntityName:  payload.EntityName,
			Location:    payload.Location,
			Description: payload.Description,
			StartDate:   startDate,
			EndDate:     endDate,
			SortOrder:   payload.SortOrder,
		}

		if err := db.Conn.Create(&item).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "create error: " + err.Error()})
			return
		}
		invalidateExperienceCache()
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

		var payload experiencePayload
		if err := c.ShouldBindJSON(&payload); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload: " + err.Error()})
			return
		}

		startDate, err := time.Parse(time.RFC3339, payload.StartDate)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid start_date format"})
			return
		}

		var endDate *time.Time
		if payload.EndDate != nil && *payload.EndDate != "" {
			t, err := time.Parse(time.RFC3339, *payload.EndDate)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "invalid end_date format"})
				return
			}
			endDate = &t
		} else if payload.EndDate == nil {
			item.EndDate = nil
		}

		item.Type = payload.Type
		item.Title = payload.Title
		item.EntityName = payload.EntityName
		item.Location = payload.Location
		item.Description = payload.Description
		item.StartDate = startDate
		if endDate != nil || payload.EndDate == nil {
			item.EndDate = endDate
		}
		item.SortOrder = payload.SortOrder

		if err := db.Conn.Save(&item).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "update error: " + err.Error()})
			return
		}
		invalidateExperienceCache()
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
		invalidateExperienceCache()
		c.JSON(http.StatusOK, gin.H{"ok": true})
	}
}
