package handlers

import (
	"net/http"
	"time"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gin-gonic/gin"
)

func GetUploadSignatureHandler(cloudinaryURL string) gin.HandlerFunc {
	return func(c *gin.Context) {
		if cloudinaryURL == "" {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Cloudinary URL is not configured"})
			return
		}

		cld, err := cloudinary.NewFromURL(cloudinaryURL)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to initialize Cloudinary"})
			return
		}

		timestamp := time.Now().Unix()
		paramsToSign, err := api.StructToParams(uploader.UploadParams{
			Folder:    "portfolio",
			Timestamp: timestamp,
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create signature params"})
			return
		}

		signature, err := api.SignParameters(paramsToSign, cld.Config.Cloud.APISecret)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to sign parameters"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"signature": signature,
			"timestamp": timestamp,
			"api_key":   cld.Config.Cloud.APIKey,
			"folder":    "portfolio",
		})
	}
}
