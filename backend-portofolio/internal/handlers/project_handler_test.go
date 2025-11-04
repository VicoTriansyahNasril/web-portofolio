package handlers

import (
	"backend-portofolio/internal/db"
	"backend-portofolio/internal/models"
	"bytes"
	"errors"
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

// =================================================================
// UNIT TEST
// =================================================================

// TestNormSlug menguji fungsi utilitas normSlug untuk berbagai skenario input.
func TestNormSlug(t *testing.T) {
	testCases := []struct {
		name     string
		input    string
		expected string
	}{
		{name: "Simple Case", input: "Hello World", expected: "hello-world"},
		{name: "With Extra Spaces", input: "  My Awesome Project  ", expected: "my-awesome-project"},
		{name: "With Special Characters", input: "Project #1: The Beginning!", expected: "project-1-the-beginning"},
		{name: "Already a Slug", input: "this-is-already-a-slug", expected: "this-is-already-a-slug"},
		{name: "Empty String", input: "", expected: ""},
		{name: "Leading and Trailing Hyphens", input: "-start-and-end-", expected: "start-and-end"},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			result := normSlug(tc.input)
			assert.Equal(t, tc.expected, result)
		})
	}
}

// =================================================================
// INTEGRATION TEST
// =================================================================

// setupMockDB adalah fungsi helper untuk inisialisasi GORM dengan mock database.
func setupMockDB(t *testing.T) (sqlmock.Sqlmock, *gorm.DB) {
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

// TestGetProjectBySlug menguji handler API untuk mendapatkan satu proyek berdasarkan slug.
func TestGetProjectBySlug(t *testing.T) {
	gin.SetMode(gin.TestMode)

	t.Run("Success Case - Project Found", func(t *testing.T) {
		mock, gormDB := setupMockDB(t)
		db.Conn = gormDB

		expectedProject := models.Project{
			ID: 1, Slug: "my-awesome-project", Title: "My Awesome Project", Summary: "This is a summary.", Status: "published",
		}

		rows := sqlmock.NewRows([]string{"id", "slug", "title", "summary", "status"}).
			AddRow(expectedProject.ID, expectedProject.Slug, expectedProject.Title, expectedProject.Summary, expectedProject.Status)

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT * FROM "projects" WHERE slug = $1 AND status = $2 ORDER BY "projects"."id" LIMIT $3`)).
			WithArgs(expectedProject.Slug, "published", 1).
			WillReturnRows(rows)

		router := gin.Default()
		router.GET("/projects/:slug", GetProjectBySlug())
		w := httptest.NewRecorder()
		req, _ := http.NewRequest(http.MethodGet, "/projects/my-awesome-project", nil)
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Contains(t, w.Body.String(), `"title":"My Awesome Project"`)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("Not Found Case", func(t *testing.T) {
		mock, gormDB := setupMockDB(t)
		db.Conn = gormDB

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT * FROM "projects" WHERE slug = $1 AND status = $2 ORDER BY "projects"."id" LIMIT $3`)).
			WithArgs("non-existent-project", "published", 1).
			WillReturnError(gorm.ErrRecordNotFound)

		router := gin.Default()
		router.GET("/projects/:slug", GetProjectBySlug())
		w := httptest.NewRecorder()
		req, _ := http.NewRequest(http.MethodGet, "/projects/non-existent-project", nil)
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusNotFound, w.Code)
		assert.Contains(t, w.Body.String(), `"error":"not found"`)
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

// TestCreateProject menguji handler API untuk membuat proyek baru.
func TestCreateProject(t *testing.T) {
	gin.SetMode(gin.TestMode)

	// Sub-tes untuk kasus ketika proyek berhasil dibuat.
	t.Run("Success Case - Project Created", func(t *testing.T) {
		// Langkah 1: Menyiapkan mock database dan mengganti koneksi global.
		mock, gormDB := setupMockDB(t)
		db.Conn = gormDB

		// Payload JSON yang akan dikirim dalam body request.
		projectPayload := `{"slug": "new-project", "title": "New Project", "summary": "A summary"}`

		// Langkah 2: Menetapkan ekspektasi pada mock sesuai urutan eksekusi di handler.
		// Handler akan membungkus operasi dalam satu transaksi.
		mock.ExpectBegin()

		// Query pertama: mendapatkan nilai sort_order maksimum.
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT MAX(sort_order) FROM "projects"`)).
			WillReturnRows(sqlmock.NewRows([]string{"max"}).AddRow(5)) // Mensimulasikan nilai max saat ini adalah 5.

		// Query kedua: INSERT data proyek baru.
		mock.ExpectQuery(regexp.QuoteMeta(`INSERT INTO "projects" ("slug","title","summary","body","cover_url","repo_url","demo_url","tech_stack","gallery_json","role","status","is_featured","view_count","sort_order","start_date","end_date","created_at","updated_at") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING "id"`)).
			WithArgs("new-project", "New Project", "A summary", "", "", "", "", "", "[]", "", "published", false, 0, 6, sqlmock.AnyArg(), sqlmock.AnyArg(), sqlmock.AnyArg(), sqlmock.AnyArg()).
			WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(1)) // Mensimulasikan ID 1 dikembalikan setelah insert.

		// Transaksi akan di-commit jika semua query berhasil.
		mock.ExpectCommit()

		// Langkah 3: Menyiapkan router dan membuat request.
		router := gin.Default()
		router.POST("/api/admin/projects", CreateProject())
		w := httptest.NewRecorder()
		req, _ := http.NewRequest(http.MethodPost, "/api/admin/projects", bytes.NewBufferString(projectPayload))
		req.Header.Set("Content-Type", "application/json")

		// Langkah 4: Menjalankan request.
		router.ServeHTTP(w, req)

		// Langkah 5: Memvalidasi hasil.
		assert.Equal(t, http.StatusCreated, w.Code, "Seharusnya menerima status 201 Created")
		assert.Contains(t, w.Body.String(), `"slug":"new-project"`, "Body respons seharusnya berisi data proyek baru")
		assert.NoError(t, mock.ExpectationsWereMet(), "Semua ekspektasi query seharusnya terpenuhi")
	})

	// Sub-tes untuk kasus ketika terjadi konflik (slug duplikat).
	t.Run("Error Case - Duplicate Slug", func(t *testing.T) {
		mock, gormDB := setupMockDB(t)
		db.Conn = gormDB

		projectPayload := `{"slug": "duplicate-slug", "title": "Duplicate Project", "summary": "A summary"}`

		// Menetapkan ekspektasi untuk alur error.
		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT MAX(sort_order) FROM "projects"`)).
			WillReturnRows(sqlmock.NewRows([]string{"max"}).AddRow(nil))

		// Mensimulasikan error 'unique constraint' dari database saat INSERT.
		mock.ExpectQuery(regexp.QuoteMeta(`INSERT INTO "projects"`)).
			WithArgs("duplicate-slug", "Duplicate Project", "A summary", "", "", "", "", "", "[]", "", "published", false, 0, 0, sqlmock.AnyArg(), sqlmock.AnyArg(), sqlmock.AnyArg(), sqlmock.AnyArg()).
			WillReturnError(errors.New("ERROR: duplicate key value violates unique constraint"))

		// Karena ada error, GORM akan melakukan Rollback.
		mock.ExpectRollback()

		router := gin.Default()
		router.POST("/api/admin/projects", CreateProject())
		w := httptest.NewRecorder()
		req, _ := http.NewRequest(http.MethodPost, "/api/admin/projects", bytes.NewBufferString(projectPayload))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(w, req)

		// Memvalidasi bahwa handler merespons dengan status 409 Conflict.
		assert.Equal(t, http.StatusConflict, w.Code)
		assert.Contains(t, w.Body.String(), `"error":"slug already exists"`)
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}
