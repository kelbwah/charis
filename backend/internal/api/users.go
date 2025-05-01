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
	patchUserRoutes(api, ctx, db, queries)
	// deleteUserRoutes(api, ctx, db, queries)
}

func getUserRoutes(api *echo.Group, ctx context.Context, db *sql.DB, queries *database.Queries) {
	api.GET("/users/me", func(c echo.Context) error {
		return routes.GetUserSelf(c, ctx, db, queries)
	})
}

func patchUserRoutes(api *echo.Group, ctx context.Context, db *sql.DB, queries *database.Queries) {
	api.PATCH("/users/me", func(c echo.Context) error {
		return routes.UpdateUser(c, ctx, db, queries)
	})
}

// func deleteUserRoutes(api *echo.Group, ctx context.Context, db *sql.DB, queries *database.Queries) {
// 	api.DELETE("/users/:id", func(c echo.Context) error {
// 		return routes.DeleteUser(c, ctx, db, queries)
// 	}, charisware.UserAuth)
// }
