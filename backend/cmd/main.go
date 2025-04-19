// main.go
package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/kelbwah/charis/backend/internal/api"
	"github.com/kelbwah/charis/backend/internal/config"
	_ "github.com/lib/pq"
)

func main() {
	appConfig, err := config.InitConfig()
	if err != nil {
		log.Fatal(err)
	}

	// Build your Echo server
	e := api.NewServer(appConfig)

	// Start it in a goroutine for graceful shutdown
	go func() {
		log.Printf("Listening on %s (prod=%s)", appConfig.BindAddr, appConfig.ProdEnv)
		if err := e.Start(appConfig.BindAddr); err != nil {
			log.Fatalf("Server error: %v", err)
		}
	}()

	// Wait for SIGINT/SIGTERM
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit
	log.Println("Shutdown signal received, shutting down...")

	// Give Echo up to 10s to finish in‑flight requests
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := e.Shutdown(ctx); err != nil {
		log.Fatalf("Error shutting down: %v", err)
	}

	// Close DB & Redis
	if err := appConfig.DB.Close(); err != nil {
		log.Printf("DB close error: %v", err)
	}
	if err := appConfig.RDB.Close(); err != nil {
		log.Printf("Redis close error: %v", err)
	}

	log.Println("Server exited cleanly")
}
