//internal/handlers/upload_handler.go
package handlers

import (
	"context"
	"net/http"
	"time"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gin-gonic/gin"
)

func UploadHandler(cloudinaryURL string) gin.HandlerFunc {
	return func(c *gin.Context) {
		if cloudinaryURL == "" {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Cloudinary URL is not configured"})
			return
		}

		file, err := c.FormFile("file")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "file not found"})
			return
		}

		fileReader, err := file.Open()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not open file"})
			return
		}
		defer fileReader.Close()

		cld, err := cloudinary.NewFromURL(cloudinaryURL)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to initialize Cloudinary"})
			return
		}

		ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
		defer cancel()

		uploadResult, err := cld.Upload.Upload(ctx, fileReader, uploader.UploadParams{
			Folder: "portfolio",
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to upload to Cloudinary"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"url": uploadResult.SecureURL,
		})
	}
}
