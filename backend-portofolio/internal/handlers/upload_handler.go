// internal/handlers/upload_handler.go
package handlers

import (
	"fmt"
	"net/http"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
)

func UploadHandler(uploadDir string) gin.HandlerFunc {
	return func(c *gin.Context) {
		file, err := c.FormFile("file")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "file not found"})
			return
		}

		ext := filepath.Ext(file.Filename)
		if ext == "" {
			ext = ".jpg"
		}
		name := fmt.Sprintf("%s.%d%s",
			time.Now().Format("20060102_150405"),
			time.Now().UnixNano()%1e9,
			ext)

		dst := filepath.Join(uploadDir, name)
		if err := c.SaveUploadedFile(file, dst); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "save error"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"url": "/uploads/" + name,
		})
	}
}
