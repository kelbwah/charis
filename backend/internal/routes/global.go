package routes

import (
	"context"
	"database/sql"

	"github.com/gorilla/websocket"
	"github.com/kelbwah/charis/backend/internal/database"
	"github.com/labstack/echo/v4"
	"github.com/redis/go-redis/v9"
)

func GlobalWSHandler(
	upgrader websocket.Upgrader, c echo.Context, ctx context.Context,
	db *sql.DB, queries *database.Queries, rdb *redis.Client,
) error {
	panic("nice")
}
