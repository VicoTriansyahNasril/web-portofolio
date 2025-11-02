// internal/db/db.go
package db

import (
	"fmt"
	"log"
	"strings" // <-- TAMBAHKAN INI
	"time"

	"backend-portofolio/internal/config"
	"backend-portofolio/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var Conn *gorm.DB

func Init(cfg config.Config) {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=require client_encoding=UTF8",
		cfg.DBHost, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBPort)

	var err error
	Conn, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger:                 logger.Default.LogMode(logger.Silent),
		SkipDefaultTransaction: true,
		PrepareStmt:            false,
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
	migrationErr := Conn.AutoMigrate(
		&models.Project{},
		&models.Profile{},
		&models.SocialLink{},
		&models.Skill{},
		&models.Experience{},
		&models.Achievement{},
		&models.PageVisit{},
	)

	if migrationErr != nil && !strings.Contains(migrationErr.Error(), "already exists") {
		log.Fatalf("DB migrate error: %v\n", migrationErr)
	} else if migrationErr != nil {
		log.Println("Migration notice: one or more tables already exist, continuing startup.")
	} else {
		log.Println("Database migration completed successfully.")
	}
}
