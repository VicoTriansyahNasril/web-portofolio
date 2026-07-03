package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// CSRFProtection enforces that state-changing requests have the proper custom headers
// This is a stateless CSRF defense (Custom Header requirement).
func CSRFProtection() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Only check state-changing methods
		if c.Request.Method == http.MethodPost || c.Request.Method == http.MethodPut || c.Request.Method == http.MethodDelete || c.Request.Method == http.MethodPatch {
			// Require X-Requested-With header (which browser natively blocks cross-origin requests from setting without explicit CORS preflight)
			if c.GetHeader("X-Requested-With") != "XMLHttpRequest" {
				c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "CSRF verification failed"})
				return
			}
		}
		c.Next()
	}
}
