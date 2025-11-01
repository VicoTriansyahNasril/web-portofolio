// portofolio/backend-portofolio/internal/middleware/cache.go
package middleware

import (
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
)

func CacheControl(duration time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.Method == "GET" {
			c.Header("Cache-Control", fmt.Sprintf("public, max-age=%.0f, s-maxage=%.0f", duration.Seconds(), duration.Seconds()*2))
		}
		c.Next()
	}
}
