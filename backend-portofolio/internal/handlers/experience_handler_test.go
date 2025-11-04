package handlers

import (
	"backend-portofolio/internal/db"
	"bytes"
	"fmt"
	"net/http"
	"net/http/httptest"
	"regexp"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

// TestExperienceHandlers menguji fungsionalitas CRUD untuk endpoint Experience.
func TestExperienceHandlers(t *testing.T) {
	gin.SetMode(gin.TestMode)
	const experienceID = 1

	// Menguji pembuatan experience baru.
	t.Run("Create Experience", func(t *testing.T) {
		mock, gormDB := setupMockDB(t)
		db.Conn = gormDB

		payload := fmt.Sprintf(`{"type":"Magang","title":"Software Engineer","entity_name":"Tech Corp","start_date":"%s"}`, time.Now().Format(time.RFC3339))

		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`INSERT INTO "experiences"`)).
			WithArgs("Magang", "Software Engineer", "Tech Corp", "", "", sqlmock.AnyArg(), nil, 0, sqlmock.AnyArg(), sqlmock.AnyArg()).
			WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(experienceID))
		mock.ExpectCommit()

		router := gin.Default()
		router.POST("/experiences", CreateExperience())
		w := httptest.NewRecorder()
		req, _ := http.NewRequest(http.MethodPost, "/experiences", bytes.NewBufferString(payload))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusCreated, w.Code)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	// Menguji pembaruan experience yang sudah ada.
	t.Run("Update Experience", func(t *testing.T) {
		mock, gormDB := setupMockDB(t)
		db.Conn = gormDB

		payload := fmt.Sprintf(`{"type":"Pekerjaan Penuh Waktu","title":"Senior Engineer","entity_name":"Tech Corp","start_date":"%s"}`, time.Now().Format(time.RFC3339))

		// GORM akan SELECT dulu untuk menemukan record.
		// PERBAIKAN: Menggunakan int64 untuk mencocokkan tipe argumen yang diharapkan oleh driver.
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT * FROM "experiences" WHERE "experiences"."id" = $1 ORDER BY "experiences"."id" LIMIT $2`)).
			WithArgs(int64(experienceID), 1).
			WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(experienceID))

		// Kemudian GORM akan menjalankan UPDATE.
		mock.ExpectBegin()
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE "experiences"`)).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectCommit()

		router := gin.Default()
		router.PUT("/experiences/:id", UpdateExperience())
		w := httptest.NewRecorder()
		req, _ := http.NewRequest(http.MethodPut, fmt.Sprintf("/experiences/%d", experienceID), bytes.NewBufferString(payload))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	// Menguji penghapusan experience.
	t.Run("Delete Experience", func(t *testing.T) {
		mock, gormDB := setupMockDB(t)
		db.Conn = gormDB

		mock.ExpectBegin()
		// PERBAIKAN: Menggunakan int64 untuk mencocokkan tipe argumen yang diharapkan oleh driver.
		mock.ExpectExec(regexp.QuoteMeta(`DELETE FROM "experiences" WHERE "experiences"."id" = $1`)).
			WithArgs(int64(experienceID)).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectCommit()

		router := gin.Default()
		router.DELETE("/experiences/:id", DeleteExperience())
		w := httptest.NewRecorder()
		req, _ := http.NewRequest(http.MethodDelete, fmt.Sprintf("/experiences/%d", experienceID), nil)
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}
