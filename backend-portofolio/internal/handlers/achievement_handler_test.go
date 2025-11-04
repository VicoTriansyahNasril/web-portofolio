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

func TestAchievementHandlers(t *testing.T) {
	gin.SetMode(gin.TestMode)
	const achievementID = 1

	t.Run("Create Achievement", func(t *testing.T) {
		mock, gormDB := setupMockDB(t)
		db.Conn = gormDB

		payload := `{"title":"Juara 1","issuer":"Kompetisi","date":"2025-01-01T00:00:00Z"}`

		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`INSERT INTO "achievements"`)).
			WithArgs("Juara 1", "Kompetisi", sqlmock.AnyArg(), "", "", "", 0, sqlmock.AnyArg(), sqlmock.AnyArg()).
			WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(achievementID))
		mock.ExpectCommit()

		router := gin.Default()
		router.POST("/achievements", CreateAchievement())
		w := httptest.NewRecorder()
		req, _ := http.NewRequest(http.MethodPost, "/achievements", bytes.NewBufferString(payload))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusCreated, w.Code)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("Update Achievement", func(t *testing.T) {
		mock, gormDB := setupMockDB(t)
		db.Conn = gormDB

		payload := `{"title":"Juara 2","issuer":"Acara","date":"2025-02-01T00:00:00Z"}`

		dateValue := time.Date(2025, 1, 1, 0, 0, 0, 0, time.UTC)
		createdAt := time.Date(2025, 1, 1, 0, 0, 0, 0, time.UTC)
		updatedAt := time.Date(2025, 1, 1, 0, 0, 0, 0, time.UTC)

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT * FROM "achievements" WHERE "achievements"."id" = $1 ORDER BY "achievements"."id" LIMIT $2`)).
			WithArgs(int64(achievementID), 1).
			WillReturnRows(sqlmock.NewRows([]string{"id", "title", "issuer", "date", "description", "credential_url", "link_text", "sort_order", "created_at", "updated_at"}).
				AddRow(achievementID, "Juara 1", "Kompetisi", dateValue, "", "", "", 0, createdAt, updatedAt))

		mock.ExpectBegin()
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE "achievements"`)).
			WithArgs("Juara 2", "Acara", sqlmock.AnyArg(), sqlmock.AnyArg(), sqlmock.AnyArg(), sqlmock.AnyArg(), sqlmock.AnyArg(), sqlmock.AnyArg(), sqlmock.AnyArg(), int64(achievementID)).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectCommit()

		router := gin.Default()
		router.PUT("/achievements/:id", UpdateAchievement())
		w := httptest.NewRecorder()
		req, _ := http.NewRequest(http.MethodPut, fmt.Sprintf("/achievements/%d", achievementID), bytes.NewBufferString(payload))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("Delete Achievement", func(t *testing.T) {
		mock, gormDB := setupMockDB(t)
		db.Conn = gormDB

		mock.ExpectBegin()
		mock.ExpectExec(regexp.QuoteMeta(`DELETE FROM "achievements" WHERE "achievements"."id" = $1`)).
			WithArgs(int64(achievementID)).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectCommit()

		router := gin.Default()
		router.DELETE("/achievements/:id", DeleteAchievement())
		w := httptest.NewRecorder()
		req, _ := http.NewRequest(http.MethodDelete, fmt.Sprintf("/achievements/%d", achievementID), nil)
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}
