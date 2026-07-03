package middleware

import (
	"github.com/gin-gonic/gin"
)

// SecurityHeaders injects strict HTTP headers to prevent common vulnerabilities (XSS, Clickjacking, MIME sniffing).
func SecurityHeaders() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Prevent clickjacking
		c.Header("X-Frame-Options", "DENY")
		// Prevent MIME-sniffing
		c.Header("X-Content-Type-Options", "nosniff")
		// Prevent Cross-Site Scripting (XSS)
		c.Header("X-XSS-Protection", "1; mode=block")
		// Enforce HTTPS
		c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
		// Basic Content Security Policy
		c.Header("Content-Security-Policy", "default-src 'self' https://res.cloudinary.com; img-src 'self' data: https://res.cloudinary.com; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' wss: https:;")
		// Prevent cross-domain tracking
		c.Header("Referrer-Policy", "strict-origin-when-cross-origin")
		// Prevent loading of unauthorized features
		c.Header("Permissions-Policy", "geolocation=(), microphone=(), camera=()")
		
		c.Next()
	}
}
