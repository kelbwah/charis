package api

import (
	"context"
	"database/sql"

	"github.com/kelbwah/charis/backend/internal/database"
	"github.com/kelbwah/charis/backend/internal/routes"
	"github.com/labstack/echo/v4"
)

func InitPrayerRoutes(api *echo.Group, ctx context.Context, db *sql.DB, queries *database.Queries) {
	postPrayerRoutes(api, ctx, db, queries)
	getPrayerRoutes(api, ctx, db, queries)
	putPrayerRoutes(api, ctx, db, queries)
	deletePrayerRoutes(api, ctx, db, queries)
}

func postPrayerRoutes(api *echo.Group, ctx context.Context, db *sql.DB, queries *database.Queries) {
	api.POST("/prayers", func(c echo.Context) error {
		return routes.CreatePrayer(c, ctx, db, queries)
	})
}

func getPrayerRoutes(api *echo.Group, ctx context.Context, db *sql.DB, queries *database.Queries) {
	api.GET("/prayers/:id", func(c echo.Context) error {
		return routes.GetPrayerByID(c, ctx, db, queries)
	})

	api.GET("/prayers/user", func(c echo.Context) error {
		return routes.GetPrayersByUser(c, ctx, db, queries)
	})

	api.GET("/prayers", func(c echo.Context) error {
		return routes.GetAllPrayers(c, ctx, db, queries)
	})

	api.GET("/prayers/:id/count", func(c echo.Context) error {
		return routes.GetPrayerCountByID(c, ctx, db, queries)
	})
}

func putPrayerRoutes(api *echo.Group, ctx context.Context, db *sql.DB, queries *database.Queries) {
	api.PUT("/prayers/:id", func(c echo.Context) error {
		return routes.UpdatePrayer(c, ctx, db, queries)
	})
}

func deletePrayerRoutes(api *echo.Group, ctx context.Context, db *sql.DB, queries *database.Queries) {
	api.DELETE("/prayers/:id", func(c echo.Context) error {
		return routes.DeletePrayer(c, ctx, db, queries)
	})
}
