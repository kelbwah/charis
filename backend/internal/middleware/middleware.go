package middleware

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
	_ "github.com/lib/pq"
)

const clerkPublicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA211X2epOqYHO5eBrnVpE
uE+MouTaAynMH1mSC3XgGWnVhS+4+qJWkn7e5rsBnOje9qDh1hDka4Onefs7i7v5
9eP6WAAdsnqslkfrdiQguQ1Q7/QzJkVxB6HDF4TtfAp/3vGxNjwTCaqEuhXz1+kQ
IDOHN/WNpJ/gQFvn5E2e72wEeQBFV+Qw7KBk9QihRJGQ7yVHYg8ahEkU71mSSqjx
o/j+f6ROHqyovGCdoZNjeAnqGVwrP+s3P4nZf3DBMhqLMOWtJlBQQWbVMLN0nukK
AI+nkApaenCSx/D8XJ9if5GOhUR6Ee62m/Mjp6HtwUf501QaF31qu8zaRWu0VJjE
XQIDAQAB
-----END PUBLIC KEY-----
`

// JWTMiddleware validates the JWT token from Clerk.
func JWTMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		fmt.Println("Here!")
		// Expect header: Authorization: Bearer <token>
		authHeader := c.Request().Header.Get("Authorization")
		if authHeader == "" {
			fmt.Println("Missing token!")
			return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Missing token"})
		}
		fmt.Println("Auth Header Retrieved.")
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid Authorization header"})
		}
		tokenString := parts[1]
		fmt.Println("Token String Retrieved.")
		// Parse and verify the token.
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// Ensure token is signed with RS256.
			if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			fmt.Println("Signing method recognized.")
			// Parse the PEM-encoded public key.
			pubKey, err := jwt.ParseRSAPublicKeyFromPEM([]byte(clerkPublicKey))
			if err != nil {
				return nil, fmt.Errorf("error parsing public key: %v", err)
			}
			fmt.Println("Public key parsed.")
			return pubKey, nil
		})
		fmt.Println("Token Retrieved!.")
		if err != nil || !token.Valid {
			return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid token"})
		}
		fmt.Println("Token is valid!.")
		// Optionally, pass token claims to the context.
		c.Set("user", token.Claims)
		return next(c)
	}
}
