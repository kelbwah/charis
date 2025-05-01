package api

import (
	"context"
	"database/sql"

	"github.com/kelbwah/charis/backend/internal/database"
	"github.com/kelbwah/charis/backend/internal/routes"
	"github.com/labstack/echo/v4"
	"github.com/redis/go-redis/v9"
)

func InitGlobalBroadcastRoute(api *echo.Group, ctx context.Context, db *sql.DB, queries *database.Queries, rdb *redis.Client) {
	api.GET("/ws/global", func(c echo.Context) error {
		return routes.GlobalWSHandler(Upgrader, c, ctx, db, queries, rdb)
	})
}
