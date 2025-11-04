package handlers

import (
	"backend-portofolio/internal/db"
	"bytes"
	"net/http"
	"net/http/httptest"
	"regexp"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func setupMockDBForProfile(t *testing.T) (sqlmock.Sqlmock, *gorm.DB) {
	mockDB, mock, err := sqlmock.New()
	assert.NoError(t, err)

	dialector := postgres.New(postgres.Config{
		Conn:       mockDB,
		DriverName: "postgres",
	})
	gormDB, err := gorm.Open(dialector, &gorm.Config{})
	assert.NoError(t, err)

	return mock, gormDB
}

func TestProfileHandlers(t *testing.T) {
	gin.SetMode(gin.TestMode)

	t.Run("Upsert Profile - Create", func(t *testing.T) {
		mock, gormDB := setupMockDBForProfile(t)
		db.Conn = gormDB

		payload := `{"full_name":"John Doe", "headline":"Software Engineer", "socials": []}`

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT * FROM "profiles" ORDER BY "profiles"."id" LIMIT $1`)).
			WithArgs(1).
			WillReturnError(gorm.ErrRecordNotFound)

		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`INSERT INTO "profiles"`)).
			WithArgs("John Doe", "Software Engineer", "", "", "", "", "").
			WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(1))
		mock.ExpectCommit()

		mock.ExpectBegin()
		mock.ExpectExec(regexp.QuoteMeta(`DELETE FROM "social_links" WHERE profile_id = $1`)).
			WithArgs(1).
			WillReturnResult(sqlmock.NewResult(0, 0))
		mock.ExpectCommit()

		router := gin.Default()
		router.PUT("/profile", UpsertProfile())
		w := httptest.NewRecorder()
		req, _ := http.NewRequest(http.MethodPut, "/profile", bytes.NewBufferString(payload))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Contains(t, w.Body.String(), "John Doe")
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("Upsert Profile - Update", func(t *testing.T) {
		mock, gormDB := setupMockDBForProfile(t)
		db.Conn = gormDB

		payload := `{"full_name":"Jane Doe", "headline":"Senior Engineer", "socials": [{"name": "GitHub", "url": "https://github.com"}]}`

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT * FROM "profiles" ORDER BY "profiles"."id" LIMIT $1`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"id", "full_name"}).AddRow(1, "John Doe"))

		mock.ExpectBegin()
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE "profiles"`)).
			WithArgs("Jane Doe", "Senior Engineer", "", "", "", "", "", 1).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectCommit()

		mock.ExpectBegin()
		mock.ExpectExec(regexp.QuoteMeta(`DELETE FROM "social_links" WHERE profile_id = $1`)).
			WithArgs(1).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectCommit()

		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`INSERT INTO "social_links"`)).
			WithArgs("GitHub", "https://github.com", "", false, 1).
			WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(1))
		mock.ExpectCommit()

		router := gin.Default()
		router.PUT("/profile", UpsertProfile())
		w := httptest.NewRecorder()
		req, _ := http.NewRequest(http.MethodPut, "/profile", bytes.NewBufferString(payload))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Contains(t, w.Body.String(), "Jane Doe")
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}
