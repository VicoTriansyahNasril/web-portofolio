package tests

import (
	"backend-portofolio/internal/db"
	"backend-portofolio/internal/models"
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestExperienceAPI_CRUD(t *testing.T) {
	t.Cleanup(clearTables)

	authToken, err := getAuthToken()
	assert.NoError(t, err)

	var createdExperience models.Experience

	t.Run("Create Experience", func(t *testing.T) {
		startDate := time.Now().Format(time.RFC3339)
		payload := fmt.Sprintf(`{"type":"Internship", "title":"Backend Developer", "entity_name":"Tech Corp", "start_date":"%s"}`, startDate)
		req, _ := http.NewRequest(http.MethodPost, "/api/admin/experiences", bytes.NewBufferString(payload))
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Authorization", "Bearer "+authToken)

		w := httptest.NewRecorder()
		testRouter.ServeHTTP(w, req)

		assert.Equal(t, http.StatusCreated, w.Code)
		err := json.Unmarshal(w.Body.Bytes(), &createdExperience)
		assert.NoError(t, err)
		assert.Equal(t, "Backend Developer", createdExperience.Title)
		assert.NotZero(t, createdExperience.ID)
	})

	t.Run("Get All Experiences", func(t *testing.T) {
		req, _ := http.NewRequest(http.MethodGet, "/api/admin/experiences", nil)
		req.Header.Set("Authorization", "Bearer "+authToken)

		w := httptest.NewRecorder()
		testRouter.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Contains(t, w.Body.String(), "Tech Corp")
	})

	t.Run("Update Experience", func(t *testing.T) {
		startDate := time.Now().Format(time.RFC3339)
		payload := fmt.Sprintf(`{"type":"Full-time", "title":"Senior Backend Developer", "entity_name":"Tech Corp", "start_date":"%s"}`, startDate)
		url := fmt.Sprintf("/api/admin/experiences/%d", createdExperience.ID)
		req, _ := http.NewRequest(http.MethodPut, url, bytes.NewBufferString(payload))
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Authorization", "Bearer "+authToken)

		w := httptest.NewRecorder()
		testRouter.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		var updatedExperience models.Experience
		db.Conn.First(&updatedExperience, createdExperience.ID)
		assert.Equal(t, "Senior Backend Developer", updatedExperience.Title)
	})

	t.Run("Delete Experience", func(t *testing.T) {
		url := fmt.Sprintf("/api/admin/experiences/%d", createdExperience.ID)
		req, _ := http.NewRequest(http.MethodDelete, url, nil)
		req.Header.Set("Authorization", "Bearer "+authToken)

		w := httptest.NewRecorder()
		testRouter.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		var count int64
		db.Conn.Model(&models.Experience{}).Where("id = ?", createdExperience.ID).Count(&count)
		assert.Equal(t, int64(0), count)
	})
}
