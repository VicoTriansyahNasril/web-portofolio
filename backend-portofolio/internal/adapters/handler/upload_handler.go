package handler

import (
	"backend-portofolio/internal/core/ports"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UploadHandler struct {
	svc ports.UploadService
}

func NewUploadHandler(svc ports.UploadService) *UploadHandler {
	return &UploadHandler{svc: svc}
}

func (h *UploadHandler) GetSignature(c *gin.Context) {
	resp, err := h.svc.GenerateSignature(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "signature generation failed"})
		return
	}
	c.JSON(http.StatusOK, resp)
}
