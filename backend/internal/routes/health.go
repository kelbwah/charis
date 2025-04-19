package routes

import (
	"github.com/labstack/echo/v4"
	"net/http"
)

func GetHealth(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{
		"isHealthy": "true",
	})
}
