package db

import (
	"fmt"
	"log"
	"time"

	"backend-portofolio/internal/config"
	"backend-portofolio/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var Conn *gorm.DB

func Init(cfg config.Config) {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		cfg.DBHost, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBPort, cfg.DBSSLMode)

	var err error
	Conn, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		SkipDefaultTransaction: true,
	})
	if err != nil {
		log.Fatalf("DB connect error: %v\n", err)
	}

	sqlDB, err := Conn.DB()
	if err != nil {
		log.Fatalf("Failed to get generic database object: %v", err)
	}

	sqlDB.SetMaxOpenConns(25)
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetConnMaxLifetime(15 * time.Minute)

	log.Println("Running database migration...")
	err = Conn.AutoMigrate(
		&models.Project{},
		&models.Profile{},
		&models.SocialLink{},
		&models.Skill{},
		&models.Experience{},
		&models.Achievement{},
		&models.PageVisit{},
	)
	if err != nil {
		log.Fatalf("DB migrate error: %v\n", err)
	}

	log.Println("Database connection and migration successful.")
}
