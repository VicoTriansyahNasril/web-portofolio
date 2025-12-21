package db

import (
	"fmt"
	"log"
	"time"

	"backend-portofolio/internal/config"
	"backend-portofolio/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var Conn *gorm.DB

func Init(cfg config.Config) {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		cfg.DBHost, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBPort, cfg.DBSSLMode)

	var err error
	for i := 0; i < 5; i++ {
		Conn, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
			SkipDefaultTransaction: true,
			Logger:                 logger.Default.LogMode(logger.Silent),
		})
		if err == nil {
			break
		}
		log.Printf("Failed to connect to DB, retrying in 5s... (%d/5)", i+1)
		time.Sleep(5 * time.Second)
	}

	if err != nil {
		log.Fatalf("DB connect error after retries: %v\n", err)
	}

	sqlDB, err := Conn.DB()
	if err != nil {
		log.Fatalf("Failed to get generic database object: %v", err)
	}
	sqlDB.SetMaxOpenConns(10)
	sqlDB.SetMaxIdleConns(5)
	sqlDB.SetConnMaxLifetime(5 * time.Minute)
	sqlDB.SetConnMaxIdleTime(2 * time.Minute)

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

	log.Println("Database connection stabilized.")
}
