// internal/middleware/auth.go
package middleware

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/labstack/echo/v4"
)

var (
	jwtSecret         = []byte(os.Getenv("JWT_SECRET"))
	serviceAPIToken   = os.Getenv("SERVICE_API_TOKEN")
	accessCookieName  = "access_token"
	refreshCookieName = "refresh_token"
)

type authErrorResponse struct {
	Error string `json:"error"`
	Code  string `json:"code"`
}

// ServiceAuth ensures each request has the correct X-Service-Token header.
func ServiceAuth(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		if c.Request().Header.Get("X-Service-Token") != serviceAPIToken {
			return c.JSON(http.StatusUnauthorized, map[string]string{"error": "invalid service token"})
		}
		return next(c)
	}
}

func unauthorized(c echo.Context, msg, code string) error {
	log.Printf("Unauthorized! %s\n", msg)
	return c.JSON(http.StatusUnauthorized, authErrorResponse{Error: msg, Code: code})
}

func UserAuth(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		cookie, err := c.Cookie(accessCookieName)
		if err != nil {
			return unauthorized(c, "missing access token", "ACCESS_MISSING")
		}
		tok, err := jwt.Parse(cookie.Value, func(t *jwt.Token) (interface{}, error) {
			return jwtSecret, nil
		})
		if err != nil || !tok.Valid {
			return unauthorized(c, "invalid access token", "ACCESS_INVALID")
		}
		claims := tok.Claims.(jwt.MapClaims)
		if claims["type"] != "access" {
			return unauthorized(c, "wrong token type", "ACCESS_WRONG_TYPE")
		}
		if float64(time.Now().Unix()) > claims["exp"].(float64) {
			return unauthorized(c, "access token expired", "ACCESS_EXPIRED")
		}
		log.Printf("Claims: %v\n\n", claims)
		c.Set("userID", claims["sub"].(string))
		return next(c)
	}
}
