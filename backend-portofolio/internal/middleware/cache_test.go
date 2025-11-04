package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestCacheControl(t *testing.T) {
	gin.SetMode(gin.TestMode)

	router := gin.New()
	router.Use(CacheControl(5 * time.Minute))
	router.GET("/test", func(c *gin.Context) {
		c.Status(http.StatusOK)
	})

	t.Run("Sets Cache-Control Header for GET", func(t *testing.T) {
		w := httptest.NewRecorder()
		req, _ := http.NewRequest(http.MethodGet, "/test", nil)
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		expectedHeader := "public, max-age=300, s-maxage=600"
		assert.Equal(t, expectedHeader, w.Header().Get("Cache-Control"))
	})

	t.Run("Does Not Set Cache-Control Header for POST", func(t *testing.T) {
		router.POST("/test-post", func(c *gin.Context) {
			c.Status(http.StatusOK)
		})

		w := httptest.NewRecorder()
		req, _ := http.NewRequest(http.MethodPost, "/test-post", nil)
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Empty(t, w.Header().Get("Cache-Control"))
	})
}
