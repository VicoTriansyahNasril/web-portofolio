//internal/config/config.go
package config

import "os"

type Config struct {
	AppPort       string
	DBHost        string
	DBPort        string
	DBUser        string
	DBPassword    string
	DBName        string
	JWTSecret     string
	AdminEmail    string
	AdminPassword string
	CORSOrigins   string
	UploadDir     string
}

func getenv(k, def string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return def
}

func Load() Config {
	return Config{
		AppPort:       getenv("APP_PORT", "8080"),
		DBHost:        getenv("DB_HOST", "db"),
		DBPort:        getenv("DB_PORT", "5432"),
		DBUser:        getenv("DB_USER", "postgres"),
		DBPassword:    getenv("DB_PASSWORD", "postgres"),
		DBName:        getenv("DB_NAME", "portfolio"),
		JWTSecret:     getenv("JWT_SECRET", "devsecret"),
		AdminEmail:    getenv("ADMIN_EMAIL", ""),
		AdminPassword: getenv("ADMIN_PASSWORD", ""),
		CORSOrigins:   getenv("CORS_ORIGINS", "http://localhost:5173"),
		UploadDir:     getenv("UPLOAD_DIR", "/app/storage/uploads"),
	}
}
