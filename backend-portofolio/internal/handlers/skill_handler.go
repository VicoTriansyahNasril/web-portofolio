package handlers

import (
	"backend-portofolio/internal/cache"
	"backend-portofolio/internal/db"
	"backend-portofolio/internal/models"
	"backend-portofolio/internal/websocket"
	"encoding/json"
	"net/http"
	"sort"
	"time"

	"github.com/gin-gonic/gin"
)

func invalidateSkillCache() {
	cache.DelByPattern("public_skills*")
	hub := websocket.GetHub()
	hub.BroadcastEvent("change", "/api/skills")
	hub.BroadcastEvent("change", "/api/profile")
}

func GetSkillsPublic() gin.HandlerFunc {
	return func(c *gin.Context) {
		const cacheKey = "public_skills_sorted"
		cached, err := cache.Get(cacheKey)
		if err == nil {
			c.Header("Content-Type", "application/json; charset=utf-8")
			c.String(http.StatusOK, cached)
			return
		}

		var profile models.Profile
		db.Conn.First(&profile)

		var groupOrder []string
		if profile.SkillGroupOrder != "" {
			json.Unmarshal([]byte(profile.SkillGroupOrder), &groupOrder)
		}

		var allSkills []models.Skill
		db.Conn.Order("sort_order asc, name asc").Find(&allSkills)

		groupOrderMap := make(map[string]int)
		for i, group := range groupOrder {
			groupOrderMap[group] = i
		}

		sort.SliceStable(allSkills, func(i, j int) bool {
			orderI, okI := groupOrderMap[allSkills[i].Group]
			orderJ, okJ := groupOrderMap[allSkills[j].Group]

			if okI && okJ {
				return orderI < orderJ
			}
			if okI {
				return true
			}
			if okJ {
				return false
			}
			return allSkills[i].Group < allSkills[j].Group
		})

		jsonData, _ := json.Marshal(allSkills)
		cache.Set(cacheKey, jsonData, 5*time.Minute)
		c.JSON(http.StatusOK, allSkills)
	}
}

func AdminListSkills() gin.HandlerFunc {
	return func(c *gin.Context) {
		var items []models.Skill
		db.Conn.Order("sort_order asc").Find(&items)
		c.JSON(http.StatusOK, items)
	}
}

type reorderSkillReq struct {
	Orders []struct {
		ID        uint `json:"id"`
		SortOrder int  `json:"sort_order"`
	} `json:"orders"`
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
			if err := tx.Model(&models.Skill{}).Where("id = ?", o.ID).Updates(map[string]interface{}{"sort_order": o.SortOrder, "updated_at": time.Now()}).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "update error: " + err.Error()})
				return
			}
		}
		if err := tx.Commit().Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "commit error"})
			return
		}
		invalidateSkillCache()
		c.JSON(http.StatusOK, gin.H{"ok": true})
	}
}

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
		invalidateSkillCache()
		c.JSON(http.StatusCreated, s)
	}
}

func UpdateSkill() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var s models.Skill
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
		invalidateSkillCache()
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
		invalidateSkillCache()
		c.JSON(http.StatusOK, gin.H{"ok": true})
	}
}
