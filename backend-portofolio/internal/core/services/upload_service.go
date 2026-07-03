package services

import (
	"context"
	"backend-portofolio/internal/core/ports"
	"time"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

type uploadService struct {
	cloudinaryURL string
}

func NewUploadService(url string) ports.UploadService {
	return &uploadService{cloudinaryURL: url}
}

func (s *uploadService) GenerateSignature(ctx context.Context) (map[string]interface{}, error) {
	cld, err := cloudinary.NewFromURL(s.cloudinaryURL)
	if err != nil {
		return nil, err
	}

	timestamp := time.Now().Unix()
	params, _ := api.StructToParams(uploader.UploadParams{
		Folder:    "portfolio",
		Timestamp: timestamp,
	})

	sign, err := api.SignParameters(params, cld.Config.Cloud.APISecret)
	if err != nil {
		return nil, err
	}

	return map[string]interface{}{
		"signature": sign,
		"timestamp": timestamp,
		"api_key":   cld.Config.Cloud.APIKey,
		"folder":    "portfolio",
	}, nil
}
