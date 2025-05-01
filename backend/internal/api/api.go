package api

import (
	"context"
	"fmt"
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
	var allowedCORSOrigins []string
	if appConfig.ProdEnv == false {
		allowedCORSOrigins = []string{"http://localhost:6969", "http://127.0.0.1:6969"}
	} else {
		allowedCORSOrigins = []string{"https://www.charisconnect.com", "https://charisconnect.com"}
	}

	fmt.Println(appConfig.ProdEnv)
	fmt.Println(allowedCORSOrigins)
	ctx := context.Background()
	e := echo.New()
	e.Use(echoware.Logger())
	e.Use(echoware.Recover())
	e.Use(echoware.CORSWithConfig(echoware.CORSConfig{
		AllowOrigins:     allowedCORSOrigins,
		AllowMethods:     []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodPatch},
		AllowCredentials: true,
	}))
	e.File("/swagger/index.html", "cmd/docs/index.html")
	e.Static("/swagger", "cmd/docs")

	/* ----- Unauthenticated Routes ----- */
	api := e.Group(apiVersion, charisware.ServiceAuth)
	api.GET("/health", routes.GetHealth)
	api.POST("/launch-emails", func(c echo.Context) error {
		return routes.CreateInitialLaunchEmailEntry(c, ctx, appConfig.DB, appConfig.DBQueries)
	})
	api.POST("/register", func(c echo.Context) error {
		return routes.RegisterHandler(c, ctx, appConfig.DB, appConfig.DBQueries)
	})
	api.POST("/login", func(c echo.Context) error {
		return routes.LoginHandler(c, ctx, appConfig.DB, appConfig.DBQueries)
	})
	api.POST("/token/refresh", func(c echo.Context) error {
		return routes.RefreshTokenHandler(c)
	})

	/* ----- Authenticated Routes ----- */
	authAPI := api.Group("", charisware.UserAuth)
	InitGlobalBroadcastRoute(authAPI, ctx, appConfig.DB, appConfig.DBQueries, appConfig.RDB)
	InitUserRoutes(authAPI, ctx, appConfig.DB, appConfig.DBQueries)
	InitPrayerRoutes(authAPI, ctx, appConfig.DB, appConfig.DBQueries)
	InitPrayerResponsesRoutes(authAPI, ctx, appConfig.DB, appConfig.DBQueries)
	InitPrayerCommentsRoutes(authAPI, ctx, appConfig.DB, appConfig.DBQueries, appConfig.RDB)
	authAPI.POST("/logout", routes.LogoutHandler)

	return e
}
