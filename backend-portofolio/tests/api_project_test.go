// portofolio/backend-portofolio/tests/api_project_test.go
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

	"github.com/stretchr/testify/assert"
)

func TestProjectAPI_CRUD(t *testing.T) {
	// t.Cleanup akan menjalankan fungsi ini setelah setiap tes (TestProjectAPI_CRUD) selesai.
	// Ini memastikan database bersih untuk tes berikutnya.
	t.Cleanup(clearTables)

	// Mendapatkan token otentikasi untuk request admin.
	authToken, err := getAuthToken()
	assert.NoError(t, err)

	var createdProject models.Project

	// =================================================================
	// Test 1: Membuat Proyek Baru (POST /api/admin/projects)
	// =================================================================
	t.Run("Create Project", func(t *testing.T) {
		projectPayload := `{"title": "New Test Project", "slug": "new-test-project", "summary": "A summary"}`
		req, _ := http.NewRequest(http.MethodPost, "/api/admin/projects", bytes.NewBufferString(projectPayload))
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Authorization", "Bearer "+authToken)

		w := httptest.NewRecorder()
		testRouter.ServeHTTP(w, req)

		// Memvalidasi respons.
		assert.Equal(t, http.StatusCreated, w.Code)
		err := json.Unmarshal(w.Body.Bytes(), &createdProject)
		assert.NoError(t, err)
		assert.Equal(t, "New Test Project", createdProject.Title)
		assert.NotZero(t, createdProject.ID)

		// Memvalidasi state database.
		var projectInDB models.Project
		db.Conn.First(&projectInDB, createdProject.ID)
		assert.Equal(t, "New Test Project", projectInDB.Title)
	})

	// =================================================================
	// Test 2: Mengambil Proyek (GET /api/admin/projects)
	// =================================================================
	t.Run("Get Projects", func(t *testing.T) {
		req, _ := http.NewRequest(http.MethodGet, "/api/admin/projects", nil)
		req.Header.Set("Authorization", "Bearer "+authToken)

		w := httptest.NewRecorder()
		testRouter.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Contains(t, w.Body.String(), "new-test-project")
	})

	// =================================================================
	// Test 3: Memperbarui Proyek (PUT /api/admin/projects/:id)
	// =================================================================
	t.Run("Update Project", func(t *testing.T) {
		updatePayload := `{"title": "Updated Test Project"}`
		url := fmt.Sprintf("/api/admin/projects/%d", createdProject.ID)
		req, _ := http.NewRequest(http.MethodPut, url, bytes.NewBufferString(updatePayload))
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Authorization", "Bearer "+authToken)

		w := httptest.NewRecorder()
		testRouter.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)

		// Memvalidasi state database.
		var projectInDB models.Project
		db.Conn.First(&projectInDB, createdProject.ID)
		assert.Equal(t, "Updated Test Project", projectInDB.Title)
	})

	// =================================================================
	// Test 4: Menghapus Proyek (DELETE /api/admin/projects/:id)
	// =================================================================
	t.Run("Delete Project", func(t *testing.T) {
		url := fmt.Sprintf("/api/admin/projects/%d", createdProject.ID)
		req, _ := http.NewRequest(http.MethodDelete, url, nil)
		req.Header.Set("Authorization", "Bearer "+authToken)

		w := httptest.NewRecorder()
		testRouter.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)

		// Memvalidasi state database.
		var count int64
		db.Conn.Model(&models.Project{}).Where("id = ?", createdProject.ID).Count(&count)
		assert.Equal(t, int64(0), count)
	})
}
