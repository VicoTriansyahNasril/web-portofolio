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
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s statement_cache_mode=describe",
		cfg.DBHost, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBPort, cfg.DBSSLMode)

	var err error
	for i := 0; i < 5; i++ {
		Conn, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
			SkipDefaultTransaction: true,
			Logger:                 logger.Default.LogMode(logger.Error),
		})
		if err == nil {
			break
		}
		log.Printf("DB connection failed, retrying... (%d/5)", i+1)
		time.Sleep(5 * time.Second)
	}

	if err != nil {
		log.Fatalf("Fatal: Database unreachable: %v\n", err)
	}

	sqlDB, err := Conn.DB()
	if err != nil {
		log.Fatal(err)
	}
	sqlDB.SetMaxOpenConns(5)
	sqlDB.SetMaxIdleConns(2)
	sqlDB.SetConnMaxLifetime(3 * time.Minute)
	sqlDB.SetConnMaxIdleTime(1 * time.Minute)

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
		log.Printf("Migration warning: %v\n", err)
	}
}
