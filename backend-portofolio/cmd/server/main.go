package main

import (
	"log"
	"os"

	"backend-portofolio/internal/cache"
	"backend-portofolio/internal/config"
	"backend-portofolio/internal/db"
	"backend-portofolio/internal/server"
)

func main() {
	cfg := config.Load()

	dbConn := db.Init(cfg)

	cache.Init(cfg)

	if err := os.MkdirAll("storage/uploads", 0o755); err != nil {
		log.Fatalf("create upload dir error: %v", err)
	}

	r := server.SetupRouter(&cfg, dbConn)

	addr := ":" + cfg.AppPort
	log.Printf("Server listening on %s", addr)
	if err := r.Run(addr); err != nil {
		log.Fatal(err)
	}
}
