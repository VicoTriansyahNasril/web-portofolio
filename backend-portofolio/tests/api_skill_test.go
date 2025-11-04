// portofolio/backend-portofolio/tests/api_skill_test.go
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

func TestSkillAPI_CRUD_and_Reorder(t *testing.T) {
	// Memastikan tabel bersih sebelum dan sesudah tes ini dijalankan.
	t.Cleanup(clearTables)

	authToken, err := getAuthToken()
	assert.NoError(t, err)

	var skill1, skill2 models.Skill

	// =================================================================
	// Test 1: Membuat Skill Pertama
	// =================================================================
	t.Run("Create First Skill", func(t *testing.T) {
		payload := `{"name": "Go", "group": "Backend"}`
		req, _ := http.NewRequest(http.MethodPost, "/api/admin/skills", bytes.NewBufferString(payload))
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Authorization", "Bearer "+authToken)

		w := httptest.NewRecorder()
		testRouter.ServeHTTP(w, req)

		assert.Equal(t, http.StatusCreated, w.Code)
		err := json.Unmarshal(w.Body.Bytes(), &skill1)
		assert.NoError(t, err)
		assert.Equal(t, "Go", skill1.Name)
		assert.Equal(t, "Backend", skill1.Group)
	})

	// =================================================================
	// Test 2: Membuat Skill Kedua
	// =================================================================
	t.Run("Create Second Skill", func(t *testing.T) {
		payload := `{"name": "React", "group": "Frontend"}`
		req, _ := http.NewRequest(http.MethodPost, "/api/admin/skills", bytes.NewBufferString(payload))
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Authorization", "Bearer "+authToken)

		w := httptest.NewRecorder()
		testRouter.ServeHTTP(w, req)

		assert.Equal(t, http.StatusCreated, w.Code)
		err := json.Unmarshal(w.Body.Bytes(), &skill2)
		assert.NoError(t, err)
		assert.Equal(t, "React", skill2.Name)
	})

	// =================================================================
	// Test 3: Mengambil Semua Skill (Admin)
	// =================================================================
	t.Run("Get All Skills", func(t *testing.T) {
		req, _ := http.NewRequest(http.MethodGet, "/api/admin/skills", nil)
		req.Header.Set("Authorization", "Bearer "+authToken)

		w := httptest.NewRecorder()
		testRouter.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		// Memastikan kedua skill yang baru dibuat ada di dalam respons.
		body := w.Body.String()
		assert.Contains(t, body, "Go")
		assert.Contains(t, body, "React")
	})

	// =================================================================
	// Test 4: Memperbarui Skill
	// =================================================================
	t.Run("Update Skill", func(t *testing.T) {
		payload := `{"name": "Golang", "group": "Backend"}`
		url := fmt.Sprintf("/api/admin/skills/%d", skill1.ID)
		req, _ := http.NewRequest(http.MethodPut, url, bytes.NewBufferString(payload))
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Authorization", "Bearer "+authToken)

		w := httptest.NewRecorder()
		testRouter.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		var updatedSkill models.Skill
		db.Conn.First(&updatedSkill, skill1.ID)
		assert.Equal(t, "Golang", updatedSkill.Name)
	})

	// =================================================================
	// Test 5: Mengubah Urutan Skill
	// =================================================================
	t.Run("Reorder Skills", func(t *testing.T) {
		// Urutan baru: React (skill2) menjadi pertama, Golang (skill1) menjadi kedua.
		payload := fmt.Sprintf(`{"orders": [{"id": %d, "sort_order": 0}, {"id": %d, "sort_order": 1}]}`, skill2.ID, skill1.ID)
		req, _ := http.NewRequest(http.MethodPost, "/api/admin/skills/reorder", bytes.NewBufferString(payload))
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Authorization", "Bearer "+authToken)

		w := httptest.NewRecorder()
		testRouter.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)

		var skillsAfterReorder []models.Skill
		// Mengambil data dari DB dengan urutan yang benar untuk verifikasi.
		db.Conn.Order("sort_order asc").Find(&skillsAfterReorder)
		assert.Len(t, skillsAfterReorder, 2)
		assert.Equal(t, "React", skillsAfterReorder[0].Name, "React seharusnya menjadi skill pertama setelah diurutkan")
		assert.Equal(t, "Golang", skillsAfterReorder[1].Name, "Golang seharusnya menjadi skill kedua setelah diurutkan")
	})

	// =================================================================
	// Test 6: Menghapus Skill
	// =================================================================
	t.Run("Delete Skill", func(t *testing.T) {
		url := fmt.Sprintf("/api/admin/skills/%d", skill1.ID)
		req, _ := http.NewRequest(http.MethodDelete, url, nil)
		req.Header.Set("Authorization", "Bearer "+authToken)

		w := httptest.NewRecorder()
		testRouter.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		var count int64
		db.Conn.Model(&models.Skill{}).Where("id = ?", skill1.ID).Count(&count)
		assert.Equal(t, int64(0), count)
	})
}