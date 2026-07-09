package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port         string
	DatabaseURL  string
	CognitoPool  string
	CognitoClient string
	CognitoRegion string
	BaseURL      string
}

func Load() *Config {
	_ = godotenv.Load()

	cfg := &Config{
		Port:           getEnv("PORT", "8080"),
		DatabaseURL:    getEnv("DATABASE_URL", ""),
		CognitoPool:    getEnv("COGNITO_POOL_ID", ""),
		CognitoClient:  getEnv("COGNITO_CLIENT_ID", ""),
		CognitoRegion:  getEnv("COGNITO_REGION", ""),
		BaseURL:       getEnv("BASE_URL", "http://localhost:8080"),
	}

	if cfg.DatabaseURL == "" {
		log.Fatal("DATABASE_URL missing")
	}

	return cfg
}

func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}