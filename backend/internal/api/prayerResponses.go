package api

import (
	"context"
	"database/sql"

	"github.com/kelbwah/charis/backend/internal/database"
	"github.com/kelbwah/charis/backend/internal/routes"
	"github.com/labstack/echo/v4"
)

func InitPrayerResponsesRoutes(api *echo.Group, ctx context.Context, db *sql.DB, queries *database.Queries) {
	postPrayerResponsesRoutes(api, ctx, db, queries)
	getPrayerResponsesRoutes(api, ctx, db, queries)
	putPrayerResponsesRoutes(api, ctx, db, queries)
}

func postPrayerResponsesRoutes(api *echo.Group, ctx context.Context, db *sql.DB, queries *database.Queries) {
	api.POST("/prayers/:id/response", func(c echo.Context) error {
		return routes.CreatePrayerResponse(c, ctx, db, queries)
	})
}

func getPrayerResponsesRoutes(api *echo.Group, ctx context.Context, db *sql.DB, queries *database.Queries) {
	api.GET("/prayers/user/responses", func(c echo.Context) error {
		return routes.GetPrayerResponses(c, ctx, db, queries)
	})
}

func putPrayerResponsesRoutes(api *echo.Group, ctx context.Context, db *sql.DB, queries *database.Queries) {
	api.PUT("/prayers/:id/response", func(c echo.Context) error {
		return routes.UpdatePrayerResponse(c, ctx, db, queries)
	})
}
