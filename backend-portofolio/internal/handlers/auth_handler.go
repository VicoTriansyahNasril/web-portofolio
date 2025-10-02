// internal/handlers/auth_handler.go
package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type LoginReq struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func LoginHandler(secret, adminEmail, adminPass string) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req LoginReq
		if err := c.ShouldBindJSON(&req); err != nil || req.Email == "" || req.Password == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "email & password required"})
			return
		}
		if req.Email != adminEmail || req.Password != adminPass {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
			return
		}
		claims := jwt.MapClaims{
			"sub":   req.Email,
			"scope": "admin",
			"exp":   time.Now().Add(24 * time.Hour).Unix(),
		}
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		tstr, _ := token.SignedString([]byte(secret))
		c.JSON(http.StatusOK, gin.H{"access_token": tstr})
	}
}
