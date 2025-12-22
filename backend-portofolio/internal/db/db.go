package db

import (
	"fmt"
	"log"
	"sync"
	"time"

	"backend-portofolio/internal/config"
	"backend-portofolio/internal/models"

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

func Init(cfg config.Config) {
	go connectWithRetry(cfg)
}

func connectWithRetry(cfg config.Config) {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=Asia/Jakarta",
		cfg.DBHost, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBPort, cfg.DBSSLMode)

	for {
		conn, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
			SkipDefaultTransaction: true,
			PrepareStmt:            false,
			Logger:                 logger.Default.LogMode(logger.Silent),
		})

		if err == nil {
			sqlDB, errPing := conn.DB()
			if errPing == nil && sqlDB.Ping() == nil {
				sqlDB.SetMaxOpenConns(4)
				sqlDB.SetMaxIdleConns(2)
				sqlDB.SetConnMaxLifetime(5 * time.Minute)
				sqlDB.SetConnMaxIdleTime(2 * time.Minute)

				conn.Logger = logger.Default.LogMode(logger.Error)

				conn.AutoMigrate(
					&models.Project{}, &models.Profile{}, &models.SocialLink{},
					&models.Skill{}, &models.Experience{}, &models.Achievement{},
					&models.PageVisit{},
				)

				mu.Lock()
				Conn = conn
				isReady = true
				mu.Unlock()

				log.Println("✅ Database connected successfully (Async Mode)")
				return
			}
		}

		log.Println("⏳ Database not ready, retrying in 5s...")
		time.Sleep(5 * time.Second)
	}
}
