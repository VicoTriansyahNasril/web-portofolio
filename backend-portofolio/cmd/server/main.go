// cmd/server/main.go
package main

import (
	"log"
	"os"

	"backend-portofolio/internal/config"
	"backend-portofolio/internal/db"
	"backend-portofolio/internal/server"
)

func main() {
	cfg := config.Load()

	db.Init(cfg)

	if err := os.MkdirAll(cfg.UploadDir, 0o755); err != nil {
		log.Fatalf("create upload dir error: %v", err)
	}

	r := server.SetupRouter(&cfg)

	addr := ":" + cfg.AppPort
	if p := os.Getenv("PORT"); p != "" {
		addr = ":" + p
	}
	log.Printf("listening on %s", addr)
	if err := r.Run(addr); err != nil {
		log.Fatal(err)
	}
}
