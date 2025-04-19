package api

import (
	"context"
	"net/http"

	"github.com/kelbwah/charis/backend/internal/config"
	charisware "github.com/kelbwah/charis/backend/internal/middleware"
	"github.com/kelbwah/charis/backend/internal/routes"
	"github.com/labstack/echo/v4"
	echoware "github.com/labstack/echo/v4/middleware"
	_ "github.com/lib/pq"
)

const apiVersion = "/api/v1"

func NewServer(appConfig *config.AppConfig) *echo.Echo {
	ctx := context.Background()
	e := echo.New()
	e.Use(echoware.Logger())
	e.Use(echoware.Recover())
	e.Use(echoware.CORSWithConfig(echoware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete},
	}))

	// Public routes
	InitGlobalBroadcastRoute(e, ctx, appConfig.DB, appConfig.DBQueries, appConfig.RDB)
	e.GET("/health", routes.GetHealth)
	e.POST("/api/v1/webhooks/clerk", func(c echo.Context) error {
		return routes.ClerkWebhookHandler(c, ctx, appConfig.DB, appConfig.DBQueries)
	})
	e.POST("/launch-emails", func(c echo.Context) error {
		return routes.CreateInitialLaunchEmailEntry(c, ctx, appConfig.DB, appConfig.DBQueries)
	})

	/* ----- Authenticated Routes ----- */
	api := e.Group(apiVersion)
	api.Use(charisware.JWTMiddleware)
	InitUserRoutes(api, ctx, appConfig.DB, appConfig.DBQueries)
	InitPrayerRoutes(api, ctx, appConfig.DB, appConfig.DBQueries)
	InitPrayerResponsesRoutes(api, ctx, appConfig.DB, appConfig.DBQueries)
	InitPrayerCommentsRoutes(e, api, ctx, appConfig.DB, appConfig.DBQueries, appConfig.RDB)

	return e
}
