package tests

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestAuthAPI_Login(t *testing.T) {
	t.Run("Successful Login", func(t *testing.T) {
		payload := `{"email": "admin@test.com", "password": "password"}`
		req, _ := http.NewRequest(http.MethodPost, "/api/auth/login", bytes.NewBufferString(payload))
		req.Header.Set("Content-Type", "application/json")

		w := httptest.NewRecorder()
		testRouter.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Contains(t, w.Body.String(), "access_token")
	})

	t.Run("Failed Login - Wrong Password", func(t *testing.T) {
		payload := `{"email": "admin@test.com", "password": "wrongpassword"}`
		req, _ := http.NewRequest(http.MethodPost, "/api/auth/login", bytes.NewBufferString(payload))
		req.Header.Set("Content-Type", "application/json")

		w := httptest.NewRecorder()
		testRouter.ServeHTTP(w, req)

		assert.Equal(t, http.StatusUnauthorized, w.Code)
		assert.Contains(t, w.Body.String(), "invalid credentials")
	})

	t.Run("Failed Login - Missing Field", func(t *testing.T) {
		payload := `{"email": "admin@test.com"}`
		req, _ := http.NewRequest(http.MethodPost, "/api/auth/login", bytes.NewBufferString(payload))
		req.Header.Set("Content-Type", "application/json")

		w := httptest.NewRecorder()
		testRouter.ServeHTTP(w, req)

		assert.Equal(t, http.StatusBadRequest, w.Code)
	})
}
