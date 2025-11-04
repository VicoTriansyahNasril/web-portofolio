package handlers

import (
	"backend-portofolio/internal/db"
	"bytes"
	"net/http"
	"net/http/httptest"
	"regexp"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func setupMockDBForAnalytics(t *testing.T) (sqlmock.Sqlmock, *gorm.DB) {
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

func TestAnalyticsHandlers(t *testing.T) {
	gin.SetMode(gin.TestMode)

	t.Run("Track Visit", func(t *testing.T) {
		mock, gormDB := setupMockDBForAnalytics(t)
		db.Conn = gormDB

		payload := `{"path":"/home"}`

		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`INSERT INTO "page_visits"`)).
			WithArgs("/home", sqlmock.AnyArg(), sqlmock.AnyArg()).
			WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(1))
		mock.ExpectCommit()

		router := gin.Default()
		router.POST("/track", TrackVisit())
		w := httptest.NewRecorder()
		req, _ := http.NewRequest(http.MethodPost, "/track", bytes.NewBufferString(payload))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("Get Visitors Summary", func(t *testing.T) {
		mock, gormDB := setupMockDBForAnalytics(t)
		db.Conn = gormDB

		now := time.Now()
		rows := sqlmock.NewRows([]string{"visitor_hash", "first_visit", "last_visit", "total_page_views"}).
			AddRow("hash123", now, now, 5)

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT visitor_hash, MIN(timestamp) as first_visit, MAX(timestamp) as last_visit, COUNT(*) as total_page_views FROM "page_visits" GROUP BY "visitor_hash"`)).
			WillReturnRows(rows)

		router := gin.Default()
		router.GET("/summary", GetVisitorsSummary())
		w := httptest.NewRecorder()
		req, _ := http.NewRequest(http.MethodGet, "/summary", nil)
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Contains(t, w.Body.String(), "hash123")
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}
