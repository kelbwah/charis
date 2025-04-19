// internal/config/config.go
package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/kelbwah/charis/backend/internal/database"
	"github.com/redis/go-redis/v9"
)

type AppConfig struct {
	DB           *sql.DB
	DBQueries    *database.Queries
	RDB          *redis.Client
	LocalPort    string // from LOCALHOST_PORT
	ProdEnv      string // from PROD_ENV ("true" or "false")
	BindAddr     string // computed host:port
	PublicAPIURL string // from PUBLIC_API_URL
	APIBaseURL   string // final URL your clients should hit
}

func InitConfig() (*AppConfig, error) {
	// load .env in dev; ignore missing in prod
	if err := godotenv.Load(); err != nil {
		log.Printf("⚠️  no .env file found: %v", err)
	}

	// 1) Raw env vars
	localPort := os.Getenv("LOCALHOST_PORT")
	if localPort == "" {
		localPort = "8080"
	}
	prodEnv := os.Getenv("PROD_ENV") // "true" means production
	publicURL := os.Getenv("PUBLIC_API_URL")

	// 2) Compute bind address
	var bindAddr string
	if prodEnv == "true" {
		bindAddr = fmt.Sprintf("0.0.0.0:%s", localPort)
	} else {
		bindAddr = fmt.Sprintf("127.0.0.1:%s", localPort)
	}

	// 3) Default PUBLIC_API_URL if not set
	if publicURL == "" {
		publicURL = fmt.Sprintf("http://%s", bindAddr)
	}

	// 4) Compute APIBaseURL (local vs. public)
	useLocal := os.Getenv("USE_LOCAL_API") // set to "false" in prod Railway
	var apiBase string
	if prodEnv == "true" && useLocal == "false" {
		apiBase = publicURL
	} else {
		apiBase = fmt.Sprintf("http://%s", bindAddr)
	}

	// 5) Postgres setup
	dbURL := os.Getenv("DATABASE_URL")
	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		return nil, err
	}
	queries := database.New(db)

	// 6) Redis setup
	rdb := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%s", os.Getenv("REDIS_HOST"), os.Getenv("REDIS_PORT")),
		Password: os.Getenv("REDIS_PASSWORD"),
		DB:       0,
	})

	return &AppConfig{
		DB:           db,
		DBQueries:    queries,
		RDB:          rdb,
		LocalPort:    localPort,
		ProdEnv:      prodEnv,
		BindAddr:     bindAddr,
		PublicAPIURL: publicURL,
		APIBaseURL:   apiBase,
	}, nil
}
