package handlers

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestLoginHandler(t *testing.T) {
	gin.SetMode(gin.TestMode)

	const secret = "test-secret"
	const adminEmail = "admin@test.com"
	const adminPass = "password"

	handler := LoginHandler(secret, adminEmail, adminPass)

	t.Run("Success Login", func(t *testing.T) {
		payload := `{"email": "admin@test.com", "password": "password"}`

		router := gin.Default()
		router.POST("/login", handler)
		w := httptest.NewRecorder()
		req, _ := http.NewRequest(http.MethodPost, "/login", bytes.NewBufferString(payload))
		req.Header.Set("Content-Type", "application/json")

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Contains(t, w.Body.String(), "access_token")
	})

	t.Run("Failed Login - Wrong Password", func(t *testing.T) {
		payload := `{"email": "admin@test.com", "password": "wrongpassword"}`

		router := gin.Default()
		router.POST("/login", handler)
		w := httptest.NewRecorder()
		req, _ := http.NewRequest(http.MethodPost, "/login", bytes.NewBufferString(payload))
		req.Header.Set("Content-Type", "application/json")

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusUnauthorized, w.Code)
	})

	t.Run("Failed Login - Invalid Payload", func(t *testing.T) {
		payload := `{"email": "admin@test.com"}` // Missing password

		router := gin.Default()
		router.POST("/login", handler)
		w := httptest.NewRecorder()
		req, _ := http.NewRequest(http.MethodPost, "/login", bytes.NewBufferString(payload))
		req.Header.Set("Content-Type", "application/json")

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusBadRequest, w.Code)
	})
}
