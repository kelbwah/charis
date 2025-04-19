package api

import (
	"context"
	"database/sql"

	"github.com/kelbwah/charis/backend/internal/database"
	"github.com/kelbwah/charis/backend/internal/routes"
	"github.com/labstack/echo/v4"
)

func InitUserRoutes(api *echo.Group, ctx context.Context, db *sql.DB, queries *database.Queries) {
	getUserRoutes(api, ctx, db, queries)
}

func getUserRoutes(api *echo.Group, ctx context.Context, db *sql.DB, queries *database.Queries) {
	api.GET("/users/:id", func(c echo.Context) error {
		return routes.GetUserByID(c, ctx, db, queries)
	})

	api.GET("/users/clerk/:clerk_id", func(c echo.Context) error {
		return routes.GetUserByClerkID(c, ctx, db, queries)
	})

	api.GET("/users/email/:email", func(c echo.Context) error {
		return routes.GetUserByEmail(c, ctx, db, queries)
	})

	api.GET("/users", func(c echo.Context) error {
		return routes.GetUsers(c, ctx, db, queries)
	})
}
