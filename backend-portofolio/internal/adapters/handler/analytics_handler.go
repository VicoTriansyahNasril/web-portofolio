package handler

import (
	"backend-portofolio/internal/core/ports"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AnalyticsHandler struct {
	svc ports.AnalyticsService
}

func NewAnalyticsHandler(svc ports.AnalyticsService) *AnalyticsHandler {
	return &AnalyticsHandler{svc: svc}
}

func (h *AnalyticsHandler) TrackVisit(c *gin.Context) {
	var req struct {
		Path string `json:"path"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid body"})
		return
	}

	if err := h.svc.TrackVisitor(c.Request.Context(), c.ClientIP(), c.Request.UserAgent(), req.Path); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to track"})
		return
	}
	c.Status(http.StatusOK)
}

func (h *AnalyticsHandler) GetVisitorsSummary(c *gin.Context) {
	summary, err := h.svc.GetVisitorsSummary(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal error"})
		return
	}
	c.JSON(http.StatusOK, summary)
}

func (h *AnalyticsHandler) GetVisitorDetail(c *gin.Context) {
	hash := c.Param("visitorHash")
	detail, err := h.svc.GetVisitorDetail(c.Request.Context(), hash)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal error"})
		return
	}
	if detail == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "visitor not found"})
		return
	}
	c.JSON(http.StatusOK, detail)
}
