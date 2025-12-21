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
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=Asia/Jakarta",
		cfg.DBHost, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBPort, cfg.DBSSLMode)

	var err error
	for i := 0; i < 10; i++ {
		Conn, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
			SkipDefaultTransaction: true,
			PrepareStmt:            false,
			Logger:                 logger.Default.LogMode(logger.Silent),
		})

		if err == nil {
			db, _ := Conn.DB()
			if errPing := db.Ping(); errPing == nil {
				log.Printf("Database connection established on attempt %d", i+1)
				break
			}
		}

		log.Printf("Database not ready, retrying in 8s... (%d/10)", i+1)
		time.Sleep(8 * time.Second)
	}

	if err != nil {
		log.Fatalf("Critical: Could not connect to database: %v", err)
	}

	sqlDB, err := Conn.DB()
	if err != nil {
		log.Fatal(err)
	}

	sqlDB.SetMaxOpenConns(4)
	sqlDB.SetMaxIdleConns(2)
	sqlDB.SetConnMaxLifetime(5 * time.Minute)
	sqlDB.SetConnMaxIdleTime(2 * time.Minute)

	Conn.AutoMigrate(
		&models.Project{},
		&models.Profile{},
		&models.SocialLink{},
		&models.Skill{},
		&models.Experience{},
		&models.Achievement{},
		&models.PageVisit{},
	)
}
