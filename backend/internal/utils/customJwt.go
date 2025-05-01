package utils

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt"
)

// Helper to generate a JWT
func GenerateJWT(sub string, ttl time.Duration, tokenType string) (string, error) {
	claims := jwt.MapClaims{
		"sub":  sub,
		"exp":  time.Now().Add(ttl).Unix(),
		"type": tokenType,
	}
	t := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return t.SignedString([]byte(os.Getenv("JWT_SECRET")))
}
