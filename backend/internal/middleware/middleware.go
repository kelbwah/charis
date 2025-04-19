package middleware

import (
	"net/http"
	"os"
	"strings"

	"github.com/labstack/echo/v4"
	_ "github.com/lib/pq"
)

// ServiceAuth rejects any request that doesn’t carry your private token.
func ServiceAuth(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		hdr := c.Request().Header.Get("Authorization")
		if !strings.HasPrefix(hdr, "Bearer ") ||
			strings.TrimPrefix(hdr, "Bearer ") != os.Getenv("SERVICE_API_TOKEN") {
			return c.JSON(http.StatusUnauthorized, map[string]string{
				"error": "invalid service token",
			})
		}
		return next(c)
	}
}
