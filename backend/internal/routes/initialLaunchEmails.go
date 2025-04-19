package routes

import (
	"context"
	"database/sql"
	"net/http"

	"github.com/google/uuid"
	"github.com/kelbwah/charis/backend/internal/database"
	"github.com/labstack/echo/v4"
)

type createInitialLaunchEmailEntryPayload struct {
	Email string `json:"email"`
}

func CreateInitialLaunchEmailEntry(c echo.Context, ctx context.Context, db *sql.DB, dbQueries *database.Queries) error {
	var payload createInitialLaunchEmailEntryPayload
	if err := c.Bind(&payload); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid payload"})
	}

	params := database.CreateLaunchEmailEntryParams{
		ID:    uuid.New(),
		Email: payload.Email,
	}

	launchEntryResponse, err := dbQueries.CreateLaunchEmailEntry(ctx, params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, launchEntryResponse)
}
