package handlers

import (
	"bytes"
	"io"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestUploadHandler(t *testing.T) {
	gin.SetMode(gin.TestMode)

	t.Run("Error - Cloudinary URL Not Configured", func(t *testing.T) {
		router := gin.Default()
		router.POST("/upload", UploadHandler(""))
		w := httptest.NewRecorder()
		req, _ := http.NewRequest(http.MethodPost, "/upload", nil)
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusInternalServerError, w.Code)
		assert.Contains(t, w.Body.String(), "Cloudinary URL is not configured")
	})

	t.Run("Error - File Not Found", func(t *testing.T) {
		router := gin.Default()
		router.POST("/upload", UploadHandler("fake-url"))
		w := httptest.NewRecorder()
		req, _ := http.NewRequest(http.MethodPost, "/upload", nil)
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusBadRequest, w.Code)
		assert.Contains(t, w.Body.String(), "file not found")
	})

	t.Run("Error - Invalid Cloudinary URL leads to Upload Fail", func(t *testing.T) {
		router := gin.Default()
		router.POST("/upload", UploadHandler("cloudinary://invalid-url"))

		body := new(bytes.Buffer)
		writer := multipart.NewWriter(body)
		part, err := writer.CreateFormFile("file", "test.txt")
		assert.NoError(t, err)
		_, err = io.WriteString(part, "this is a test file")
		assert.NoError(t, err)
		writer.Close()

		w := httptest.NewRecorder()
		req, _ := http.NewRequest(http.MethodPost, "/upload", body)
		req.Header.Set("Content-Type", writer.FormDataContentType())
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusInternalServerError, w.Code)
		assert.Contains(t, w.Body.String(), "failed to upload to Cloudinary")
	})
}
