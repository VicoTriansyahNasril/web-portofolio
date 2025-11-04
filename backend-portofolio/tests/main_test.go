package tests

import (
	"backend-portofolio/internal/config"
	"backend-portofolio/internal/db"
	"backend-portofolio/internal/models"
	"backend-portofolio/internal/server"
	"fmt"
	"log"
	"net/http"
	"os"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var testRouter http.Handler
var testConfig config.Config

func TestMain(m *testing.M) {
	testConfig = config.Config{
		AppPort:       "8081",
		DBHost:        "localhost",
		DBPort:        "5433",
		DBUser:        "testuser",
		DBPassword:    "testpassword",
		DBName:        "portfolio_test",
		JWTSecret:     "test-secret",
		AdminEmail:    "admin@test.com",
		AdminPassword: "password",
	}

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		testConfig.DBHost, testConfig.DBUser, testConfig.DBPassword, testConfig.DBName, testConfig.DBPort)

	var err error
	db.Conn, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Gagal terhubung ke database tes: %v", err)
	}

	err = db.Conn.AutoMigrate(
		&models.Project{}, &models.Profile{}, &models.SocialLink{},
		&models.Skill{}, &models.Experience{}, &models.Achievement{}, &models.PageVisit{},
	)
	if err != nil {
		log.Fatalf("Gagal menjalankan migrasi: %v", err)
	}

	testRouter = server.SetupRouter(&testConfig)

	exitCode := m.Run()

	os.Exit(exitCode)
}

func clearTables() {
	db.Conn.Exec("DELETE FROM social_links")
	db.Conn.Exec("DELETE FROM projects")
	db.Conn.Exec("DELETE FROM skills")
	db.Conn.Exec("DELETE FROM achievements")
	db.Conn.Exec("DELETE FROM experiences")
	db.Conn.Exec("DELETE FROM profiles")
	db.Conn.Exec("DELETE FROM page_visits")
}

func getAuthToken() (string, error) {
	claims := jwt.MapClaims{
		"sub":   testConfig.AdminEmail,
		"scope": "admin",
		"exp":   time.Now().Add(time.Hour * 1).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(testConfig.JWTSecret))
}
