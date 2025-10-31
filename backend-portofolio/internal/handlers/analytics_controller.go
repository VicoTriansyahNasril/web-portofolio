// internal/handlers/analytics_controller.go
package handlers

import (
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"net/http"
	"sort"
	"time"

	"backend-portofolio/internal/db"
	"backend-portofolio/internal/models"

	"github.com/gin-gonic/gin"
)

func createVisitorHash(ip string, userAgent string) string {
	salt := "your-very-secret-static-salt-for-hashing-visitors"
	rawIdentifier := fmt.Sprintf("%s-%s-%s", ip, userAgent, salt)
	hasher := sha256.New()
	hasher.Write([]byte(rawIdentifier))
	return base64.URLEncoding.EncodeToString(hasher.Sum(nil))
}

func TrackVisit() gin.HandlerFunc {
	return func(c *gin.Context) {
		type TrackRequest struct {
			Path      string `json:"path"`
			VisitorID string `json:"visitorId"`
		}
		var request TrackRequest
		if err := c.ShouldBindJSON(&request); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot parse JSON"})
			return
		}

		var visitorHash string
		if request.VisitorID != "" {
			visitorHash = request.VisitorID
		} else {
			visitorHash = createVisitorHash(c.ClientIP(), c.GetHeader("User-Agent"))
		}

		visit := models.PageVisit{
			Path:        request.Path,
			VisitorHash: visitorHash,
			Timestamp:   time.Now(),
		}
		if err := db.Conn.Create(&visit).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save visit"})
			return
		}
		c.Status(http.StatusOK)
	}
}

func GetVisitorsSummary() gin.HandlerFunc {
	return func(c *gin.Context) {
		type RawSummary struct {
			VisitorHash    string
			FirstVisit     time.Time
			LastVisit      time.Time
			TotalPageViews int64
		}
		type VisitorSummaryResponse struct {
			VisitorHash    string    `json:"visitorHash"`
			VisitorNumber  int       `json:"visitorNumber"`
			FirstVisit     time.Time `json:"firstVisit"`
			LastVisit      time.Time `json:"lastVisit"`
			TotalPageViews int64     `json:"totalPageViews"`
		}

		var rawSummaries []RawSummary
		db.Conn.Model(&models.PageVisit{}).
			Select("visitor_hash, MIN(timestamp) as first_visit, MAX(timestamp) as last_visit, COUNT(*) as total_page_views").
			Group("visitor_hash").
			Find(&rawSummaries)

		sort.Slice(rawSummaries, func(i, j int) bool {
			return rawSummaries[i].FirstVisit.Before(rawSummaries[j].FirstVisit)
		})

		numberedSummaries := make([]VisitorSummaryResponse, len(rawSummaries))
		for i, s := range rawSummaries {
			numberedSummaries[i] = VisitorSummaryResponse{
				VisitorHash:    s.VisitorHash,
				VisitorNumber:  i + 1,
				FirstVisit:     s.FirstVisit,
				LastVisit:      s.LastVisit,
				TotalPageViews: s.TotalPageViews,
			}
		}

		sort.Slice(numberedSummaries, func(i, j int) bool {
			return numberedSummaries[i].LastVisit.After(numberedSummaries[j].LastVisit)
		})

		c.JSON(http.StatusOK, numberedSummaries)
	}
}

func GetVisitorDetail() gin.HandlerFunc {
	return func(c *gin.Context) {
		visitorHash := c.Param("visitorHash")
		type PageFrequency struct {
			Path  string `json:"path"`
			Count int    `json:"count"`
		}
		type VisitorDetailResponse struct {
			VisitorHash     string             `json:"visitorHash"`
			FirstVisit      time.Time          `json:"firstVisit"`
			LastVisit       time.Time          `json:"lastVisit"`
			TotalPageViews  int                `json:"totalPageViews"`
			PageFrequencies []PageFrequency    `json:"pageFrequencies"`
			VisitLog        []models.PageVisit `json:"visitLog"`
		}

		var visits []models.PageVisit
		db.Conn.Where("visitor_hash = ?", visitorHash).Order("timestamp desc").Find(&visits)

		if len(visits) == 0 {
			c.Status(http.StatusNotFound)
			return
		}

		freqMap := make(map[string]int)
		for _, v := range visits {
			freqMap[v.Path]++
		}
		pageFrequencies := make([]PageFrequency, 0, len(freqMap))
		for path, count := range freqMap {
			pageFrequencies = append(pageFrequencies, PageFrequency{Path: path, Count: count})
		}
		sort.Slice(pageFrequencies, func(i, j int) bool {
			return pageFrequencies[i].Count > pageFrequencies[j].Count
		})

		response := VisitorDetailResponse{
			VisitorHash:     visitorHash,
			FirstVisit:      visits[len(visits)-1].Timestamp,
			LastVisit:       visits[0].Timestamp,
			TotalPageViews:  len(visits),
			PageFrequencies: pageFrequencies,
			VisitLog:        visits,
		}

		c.JSON(http.StatusOK, response)
	}
}
