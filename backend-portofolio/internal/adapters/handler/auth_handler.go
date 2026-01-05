package handler

import (
	"backend-portofolio/internal/core/ports"
	"backend-portofolio/internal/dto"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	svc ports.AuthService
}

func NewAuthHandler(svc ports.AuthService) *AuthHandler {
	return &AuthHandler{svc: svc}
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req dto.LoginReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid body"})
		return
	}

	token, err := h.svc.Login(req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"access_token": token})
}
