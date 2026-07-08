package db

import (
	"fmt"
	"log"
	"sync"
	"time"

	"backend-portofolio/internal/config"
	"backend-portofolio/internal/core/domain"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var (
	Conn    *gorm.DB
	isReady bool
	mu      sync.RWMutex
)

func IsConnected() bool {
	mu.RLock()
	defer mu.RUnlock()
	return isReady
}

func Init(cfg config.Config) *gorm.DB {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=Asia/Jakarta",
		cfg.DBHost, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBPort, cfg.DBSSLMode)

	var db *gorm.DB
	var err error

	for {
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
			Logger: logger.Default.LogMode(logger.Info),
		})

		if err == nil {
			sqlDB, errPing := db.DB()
			if errPing == nil && sqlDB.Ping() == nil {
				sqlDB.SetMaxOpenConns(10)
				sqlDB.SetMaxIdleConns(5)
				sqlDB.SetConnMaxLifetime(5 * time.Minute)

				log.Println("✅ Database connected successfully")

				err = db.AutoMigrate(
					&domain.Project{}, &domain.Profile{}, &domain.SocialLink{},
					&domain.Skill{}, &domain.Experience{}, &domain.Achievement{},
					&domain.PageVisit{}, &domain.Testimonial{},
				)
				if err != nil {
					log.Printf("⚠️ Migration warning: %v", err)
				}

				mu.Lock()
				Conn = db
				isReady = true
				mu.Unlock()

				return db
			}
		}

		log.Println("⏳ Database not ready, retrying in 2s...")
		time.Sleep(2 * time.Second)
	}
}
