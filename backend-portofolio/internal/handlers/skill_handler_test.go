package handlers

import (
	"backend-portofolio/internal/db"
	"bytes"
	"errors"
	"net/http"
	"net/http/httptest"
	"regexp"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

// TestCreateSkill menguji handler API untuk membuat skill baru.
func TestCreateSkill(t *testing.T) {
	gin.SetMode(gin.TestMode)

	// Menguji kasus sukses pembuatan skill.
	t.Run("Success Case - Skill Created", func(t *testing.T) {
		mock, gormDB := setupMockDB(t)
		db.Conn = gormDB

		skillPayload := `{"name": "Go", "group": "Backend"}`

		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`INSERT INTO "skills" ("group","name","sort_order","created_at","updated_at") VALUES ($1,$2,$3,$4,$5) RETURNING "id"`)).
			WithArgs("Backend", "Go", 0, sqlmock.AnyArg(), sqlmock.AnyArg()).
			WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(1))
		mock.ExpectCommit()

		router := gin.Default()
		router.POST("/api/admin/skills", CreateSkill())
		w := httptest.NewRecorder()
		req, _ := http.NewRequest(http.MethodPost, "/api/admin/skills", bytes.NewBufferString(skillPayload))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusCreated, w.Code)
		assert.Contains(t, w.Body.String(), `"name":"Go"`)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	// Menguji kasus ketika payload yang dikirim tidak valid.
	t.Run("Error Case - Invalid Payload", func(t *testing.T) {
		invalidPayload := `{"group": "Backend"}` // Nama skill hilang

		router := gin.Default()
		router.POST("/api/admin/skills", CreateSkill())
		w := httptest.NewRecorder()
		req, _ := http.NewRequest(http.MethodPost, "/api/admin/skills", bytes.NewBufferString(invalidPayload))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(w, req)

		// Handler seharusnya merespons dengan 400 Bad Request karena validasi binding gagal.
		assert.Equal(t, http.StatusBadRequest, w.Code)
	})

	// Menguji kasus ketika terjadi error dari database saat mencoba membuat skill.
	t.Run("Error Case - Database Error", func(t *testing.T) {
		mock, gormDB := setupMockDB(t)
		db.Conn = gormDB

		skillPayload := `{"name": "Go", "group": "Backend"}`

		// Mensimulasikan bahwa query INSERT akan mengembalikan error.
		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`INSERT INTO "skills"`)).
			WillReturnError(errors.New("database connection lost"))
		mock.ExpectRollback()

		router := gin.Default()
		router.POST("/api/admin/skills", CreateSkill())
		w := httptest.NewRecorder()
		req, _ := http.NewRequest(http.MethodPost, "/api/admin/skills", bytes.NewBufferString(skillPayload))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(w, req)

		// Handler seharusnya merespons dengan 500 Internal Server Error.
		assert.Equal(t, http.StatusInternalServerError, w.Code)
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}
