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
	SMTPHost      string
	SMTPPort      string
	SMTPUser      string
	SMTPPass      string
	ContactEmail  string
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
		DBUser:        getenv("DB_USER", ""),
		DBPassword:    getenv("DB_PASSWORD", ""),
		DBName:        getenv("DB_NAME", ""),
		DBSSLMode:     getenv("DB_SSL_MODE", "disable"),
		JWTSecret:     getenv("JWT_SECRET", ""),
		AdminEmail:    getenv("ADMIN_EMAIL", ""),
		AdminPassword: getenv("ADMIN_PASSWORD", ""),
		CORSOrigins:   getenv("CORS_ORIGINS", ""),
		CloudinaryURL: getenv("CLOUDINARY_URL", ""),
		RedisURL:      getenv("REDIS_URL", ""),
		SMTPHost:      getenv("SMTP_HOST", ""),
		SMTPPort:      getenv("SMTP_PORT", ""),
		SMTPUser:      getenv("SMTP_USER", ""),
		SMTPPass:      getenv("SMTP_PASS", ""),
		ContactEmail:  getenv("CONTACT_EMAIL", getenv("ADMIN_EMAIL", "")),
	}
}
