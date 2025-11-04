package tests

import (
	"backend-portofolio/internal/db"
	"backend-portofolio/internal/models"
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestProfileAPI_Upsert(t *testing.T) {
	t.Cleanup(clearTables)

	authToken, err := getAuthToken()
	assert.NoError(t, err)

	t.Run("Create Profile", func(t *testing.T) {
		payload := `{"full_name": "John Doe", "headline": "Software Engineer", "socials": [{"name": "GitHub", "url": "https://github.com", "active": true}]}`
		req, _ := http.NewRequest(http.MethodPut, "/api/admin/profile", bytes.NewBufferString(payload))
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Authorization", "Bearer "+authToken)

		w := httptest.NewRecorder()
		testRouter.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Contains(t, w.Body.String(), "John Doe")
		assert.Contains(t, w.Body.String(), "GitHub")

		var p models.Profile
		db.Conn.Preload("Socials").First(&p)
		assert.Equal(t, "John Doe", p.FullName)
		assert.Len(t, p.Socials, 1)
		assert.Equal(t, "GitHub", p.Socials[0].Name)
	})

	t.Run("Update Profile", func(t *testing.T) {
		payload := `{"full_name": "Jane Doe", "headline": "Senior Software Engineer", "socials": []}`
		req, _ := http.NewRequest(http.MethodPut, "/api/admin/profile", bytes.NewBufferString(payload))
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Authorization", "Bearer "+authToken)

		w := httptest.NewRecorder()
		testRouter.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Contains(t, w.Body.String(), "Jane Doe")
		assert.NotContains(t, w.Body.String(), "GitHub")

		var p models.Profile
		db.Conn.Preload("Socials").First(&p)
		assert.Equal(t, "Jane Doe", p.FullName)
		assert.Len(t, p.Socials, 0)
	})
}
