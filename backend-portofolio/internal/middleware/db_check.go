package middleware

import (
	"net/http"

	"backend-portofolio/internal/db"

	"github.com/gin-gonic/gin"
)

func RequireDB() gin.HandlerFunc {
	return func(c *gin.Context) {
		if !db.IsConnected() {
			c.JSON(http.StatusServiceUnavailable, gin.H{
				"error":       "System initializing",
				"message":     "Database connection in progress, please retry shortly.",
				"retry_after": 5,
			})
			c.Abort()
			return
		}
		c.Next()
	}
}
