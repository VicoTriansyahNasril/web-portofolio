// portofolio/backend-portofolio/tests/api_achievement_test.go
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

func TestAchievementAPI_CRUD(t *testing.T) {
	t.Cleanup(func() {
		db.Conn.Exec("DELETE FROM achievements")
	})

	authToken, err := getAuthToken()
	assert.NoError(t, err)

	var createdAchievement models.Achievement

	// =================================================================
	// Test 1: Membuat Achievement
	// =================================================================
	t.Run("Create Achievement", func(t *testing.T) {
		achievementDate := time.Now().Format(time.RFC3339)
		payload := fmt.Sprintf(`{"title": "Juara 1 Hackathon", "issuer": "Tech Event", "date": "%s"}`, achievementDate)
		req, _ := http.NewRequest(http.MethodPost, "/api/admin/achievements", bytes.NewBufferString(payload))
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Authorization", "Bearer "+authToken)

		w := httptest.NewRecorder()
		testRouter.ServeHTTP(w, req)

		assert.Equal(t, http.StatusCreated, w.Code)
		err := json.Unmarshal(w.Body.Bytes(), &createdAchievement)
		assert.NoError(t, err)
		assert.Equal(t, "Juara 1 Hackathon", createdAchievement.Title)
		assert.NotZero(t, createdAchievement.ID)
	})

	// =================================================================
	// Test 2: Mengambil Semua Achievement
	// =================================================================
	t.Run("Get All Achievements", func(t *testing.T) {
		req, _ := http.NewRequest(http.MethodGet, "/api/admin/achievements", nil)
		req.Header.Set("Authorization", "Bearer "+authToken)

		w := httptest.NewRecorder()
		testRouter.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Contains(t, w.Body.String(), "Juara 1 Hackathon")
	})

	// =================================================================
	// Test 3: Memperbarui Achievement
	// =================================================================
	t.Run("Update Achievement", func(t *testing.T) {
		achievementDate := time.Now().Format(time.RFC3339)
		payload := fmt.Sprintf(`{"title": "Juara 1 Lomba Koding", "issuer": "Tech Event", "date": "%s"}`, achievementDate)
		url := fmt.Sprintf("/api/admin/achievements/%d", createdAchievement.ID)
		req, _ := http.NewRequest(http.MethodPut, url, bytes.NewBufferString(payload))
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Authorization", "Bearer "+authToken)

		w := httptest.NewRecorder()
		testRouter.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		var updatedAchievement models.Achievement
		db.Conn.First(&updatedAchievement, createdAchievement.ID)
		assert.Equal(t, "Juara 1 Lomba Koding", updatedAchievement.Title)
	})

	// =================================================================
	// Test 4: Menghapus Achievement
	// =================================================================
	t.Run("Delete Achievement", func(t *testing.T) {
		url := fmt.Sprintf("/api/admin/achievements/%d", createdAchievement.ID)
		req, _ := http.NewRequest(http.MethodDelete, url, nil)
		req.Header.Set("Authorization", "Bearer "+authToken)

		w := httptest.NewRecorder()
		testRouter.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		var count int64
		db.Conn.Model(&models.Achievement{}).Where("id = ?", createdAchievement.ID).Count(&count)
		assert.Equal(t, int64(0), count)
	})
}
