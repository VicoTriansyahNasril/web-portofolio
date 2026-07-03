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

	token, err := h.svc.Login(c.Request.Context(), req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	c.SetCookie("admin-token", token, 3600*24, "/", "", false, true) // Secure=false for local dev, should be true for production. HttpOnly=true

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func (h *AuthHandler) Logout(c *gin.Context) {
	c.SetCookie("admin-token", "", -1, "/", "", false, true)
	c.JSON(http.StatusOK, gin.H{"message": "logged out"})
}
