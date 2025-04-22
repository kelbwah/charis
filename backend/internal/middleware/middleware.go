package middleware

import (
	"net/http"
	"os"
	"strings"

	"github.com/golang-jwt/jwt"
	"github.com/labstack/echo/v4"
	_ "github.com/lib/pq"
)

func ServiceAuth(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		token := c.Request().Header.Get("X-Service-Token")
		if token == "" || token != os.Getenv("SERVICE_API_TOKEN") {
			return c.JSON(http.StatusUnauthorized, map[string]string{
				"error": "invalid service token",
			})
		}
		return next(c)
	}
}

func UserAuth(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		hdr := c.Request().Header.Get("Authorization")
		if !strings.HasPrefix(hdr, "Bearer ") {
			return c.JSON(http.StatusUnauthorized, map[string]string{
				"error": "missing bearer token",
			})
		}

		tokenStr := strings.TrimPrefix(hdr, "Bearer ")
		token, err := jwt.ParseWithClaims(tokenStr, &jwt.StandardClaims{}, func(t *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("JWT_SECRET")), nil
		})
		if err != nil || !token.Valid {
			return c.JSON(http.StatusUnauthorized, map[string]string{
				"error": "invalid user token",
			})
		}

		claims := token.Claims.(*jwt.StandardClaims)
		c.Set("userID", claims.Subject)

		return next(c)
	}
}
