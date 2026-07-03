package handler

import (
	"net/http"

	"backend-portofolio/internal/core/ports"
	"backend-portofolio/internal/dto"

	"github.com/gin-gonic/gin"
)

type ContactHandler struct {
	svc ports.ContactService
}

func NewContactHandler(svc ports.ContactService) *ContactHandler {
	return &ContactHandler{svc: svc}
}

func (h *ContactHandler) SendMessage(c *gin.Context) {
	var req dto.ContactReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body", "details": err.Error()})
		return
	}

	if err := h.svc.SendMessage(c.Request.Context(), req.Name, req.Email, req.Message); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send message"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Message sent successfully"})
}
