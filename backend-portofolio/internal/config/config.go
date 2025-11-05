package config

import "os"

type Config struct {
	AppPort       string
	DBHost        string
	DBPort        string
	DBUser        string
	DBPassword    string
	DBName        string
	DBSSLMode     string
	JWTSecret     string
	AdminEmail    string
	AdminPassword string
	CORSOrigins   string
	CloudinaryURL string
	RedisURL      string
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
		DBSSLMode:     getenv("DB_SSL_MODE", "disable"),
		JWTSecret:     getenv("JWT_SECRET", "devsecret"),
		AdminEmail:    getenv("ADMIN_EMAIL", ""),
		AdminPassword: getenv("ADMIN_PASSWORD", ""),
		CORSOrigins:   getenv("CORS_ORIGINS", "http://localhost:5173"),
		CloudinaryURL: getenv("CLOUDINARY_URL", ""),
		RedisURL:      getenv("REDIS_URL", "redis://redis:6379/0"),
	}
}
