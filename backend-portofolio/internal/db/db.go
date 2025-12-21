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
			Logger:                 logger.Default.LogMode(logger.Error),
			PrepareStmt:            false,
		})
		if err == nil {
			break
		}
		log.Printf("Waiting for Supabase to wake up... (%d/10)", i+1)
		time.Sleep(8 * time.Second)
	}

	if err != nil {
		log.Fatalf("Critical Error: Database unreachable: %v", err)
	}

	sqlDB, err := Conn.DB()
	if err != nil {
		log.Fatal(err)
	}

	sqlDB.SetMaxOpenConns(5)
	sqlDB.SetMaxIdleConns(2)
	sqlDB.SetConnMaxLifetime(15 * time.Minute)
	sqlDB.SetConnMaxIdleTime(5 * time.Minute)

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
		log.Printf("Migration notice: %v", err)
	}
}
