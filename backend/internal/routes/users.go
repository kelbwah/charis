package routes

import (
	"context"
	"database/sql"
	"fmt"
	"net/http"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/kelbwah/charis/backend/internal/database"
	"github.com/kelbwah/charis/backend/internal/utils"
	"github.com/labstack/echo/v4"
)

type getUserResponse struct {
	ID        uuid.UUID `json:"id"`
	Email     string    `json:"email"`
	Username  string    `json:"username"`
	Biography string    `json:"biography"`
	CreatedAt time.Time `json:"created_at"`
}

// userResponse is the JSON shape returned for GET /users/me
type patchUserResponse struct {
	Updated string `json:"updated"`
}

// updateUserPayload represents the JSON payload for updating a user.
type updateUserPayload struct {
	Email     string `json:"email" validate:"email"`
	Password  string `json:"password" validate:"min=8"`
	Biography string `json:"biography" validate:"min=3,max=150"`
	Username  string `json:"username" validate:"alphanum,min=3,max=18"`
}

func GetUserSelf(c echo.Context, ctx context.Context, db *sql.DB, dbQueries *database.Queries) error {
	userIdStr, ok := c.Get("userID").(string)
	if !ok {
		return c.JSON(http.StatusUnauthorized, errorResponse{Error: "invalid session"})
	}
	userID, err := uuid.Parse(userIdStr)
	if err != nil {
		return c.JSON(http.StatusBadRequest, errorResponse{Error: "Invalid user ID format"})
	}

	user, err := dbQueries.GetUserByID(ctx, userID)
	if err == sql.ErrNoRows {
		return c.JSON(http.StatusNotFound, errorResponse{Error: "user not found"})
	} else if err != nil {
		return c.JSON(http.StatusInternalServerError, errorResponse{Error: "Internal Server Error. Please try again later."})
	}

	resp := getUserResponse{
		ID:        user.ID,
		Email:     user.Email,
		Username:  user.Username,
		Biography: user.Biography,
		CreatedAt: user.CreatedAt,
	}

	return c.JSON(http.StatusOK, resp)
}

func UpdateUser(c echo.Context, ctx context.Context, db *sql.DB, dbQueries *database.Queries) error {
	// Bind and validate payload
	var payload updateUserPayload
	if err := c.Bind(&payload); err != nil {
		return c.JSON(http.StatusBadRequest, errorResponse{Error: "Invalid payload"})
	}
	if err := utils.Validate.Struct(&payload); err != nil {
		errs := err.(validator.ValidationErrors)
		out := make(map[string]string, len(errs))
		for _, fe := range errs {
			out[fe.Field()] = fmt.Sprintf("failed on '%s' rule", fe.Tag())
		}
		return c.JSON(http.StatusBadRequest, out)
	}

	// Getting user_id from JWT cookie
	userIdStr, ok := c.Get("userId").(string)
	if !ok {
		return c.JSON(http.StatusUnauthorized, errorResponse{Error: "invalid session"})
	}
	userID, err := uuid.Parse(userIdStr)
	if err != nil {
		return c.JSON(http.StatusBadRequest, errorResponse{Error: "Invalid user ID format"})
	}

	// Updating user
	params := database.UpdateUserParams{
		ID:        userID,
		Email:     payload.Email,
		Password:  payload.Password,
		Biography: payload.Biography,
		Username:  payload.Username,
	}
	_, err = dbQueries.UpdateUser(ctx, params)
	if err == sql.ErrNoRows {
		return c.JSON(http.StatusNotFound, errorResponse{Error: err.Error()})
	}
	if err != nil {
		return c.JSON(http.StatusInternalServerError, errorResponse{Error: err.Error()})
	}

	return c.JSON(http.StatusOK, patchUserResponse{Updated: "true"})
}
