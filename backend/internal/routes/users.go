package routes

import (
	"context"
	"database/sql"
	"errors"
	"net/http"

	"github.com/golang-jwt/jwt/v4"
	"github.com/google/uuid"
	"github.com/kelbwah/charis/backend/internal/database"
	"github.com/labstack/echo/v4"
)

func CreateUser(c echo.Context, ctx context.Context, db *sql.DB, dbQueries *database.Queries, data map[string]interface{}) error {
	clerkID, ok := data["id"].(string)
	if !ok {
		return errors.New("invalid or missing 'id' in payload")
	}

	username, ok := data["username"].(string)
	if !ok {
		return errors.New("invalid or missing 'username' in payload")
	}

	emails, ok := data["email_addresses"].([]interface{})
	if !ok || len(emails) == 0 {
		return errors.New("invalid or missing 'email_addresses' in payload")
	}

	emailMap, ok := emails[0].(map[string]interface{})
	if !ok {
		return errors.New("invalid email format in payload")
	}

	email, ok := emailMap["email_address"].(string)
	if !ok {
		return errors.New("invalid or missing 'email_address' in payload")
	}

	avatarSrc, ok := data["image_url"].(string)
	if !ok {
		return errors.New("invalid or missing 'image_url' in payload")
	}

	params := database.CreateUserParams{
		ID:        uuid.New(),
		ClerkID:   clerkID,
		Email:     email,
		AvatarSrc: avatarSrc,
		Username:  username,
	}

	_, err := dbQueries.CreateUser(ctx, params)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, map[string]string{"created": "true"})
}

func UpdateUser(c echo.Context, ctx context.Context, db *sql.DB, dbQueries *database.Queries, data map[string]interface{}) error {
	clerkID, ok := data["id"].(string)
	if !ok {
		return errors.New("invalid or missing 'id' in payload")
	}

	username, ok := data["username"].(string)
	if !ok {
		return errors.New("invalid or missing 'username' in payload")
	}

	emails, ok := data["email_addresses"].([]interface{})
	if !ok || len(emails) == 0 {
		return errors.New("invalid or missing 'email_addresses' in payload")
	}

	emailMap, ok := emails[0].(map[string]interface{})
	if !ok {
		return errors.New("invalid email format in payload")
	}

	email, ok := emailMap["email_address"].(string)
	if !ok {
		return errors.New("invalid or missing 'email_address' in payload")
	}

	avatarSrc, ok := data["image_url"].(string)
	if !ok {
		return errors.New("invalid or missing 'image_url' in payload")
	}

	params := database.UpdateUserParams{
		ClerkID:   clerkID,
		Email:     email,
		Username:  username,
		AvatarSrc: avatarSrc,
	}

	err := dbQueries.UpdateUser(ctx, params)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, map[string]string{"updated": "true"})
}

func DeleteUser(c echo.Context, ctx context.Context, db *sql.DB, dbQueries *database.Queries, data map[string]interface{}) error {
	clerkID, ok := data["id"].(string)
	if !ok {
		return errors.New("invalid or missing 'id' in payload")
	}

	err := dbQueries.DeleteUserByClerkID(ctx, clerkID)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, map[string]string{"deleted": "true"})
}

func validateUser(c echo.Context, ctx context.Context, dbQueries *database.Queries) (uuid.UUID, error) {
	userClaims, ok := c.Get("user").(jwt.MapClaims)
	if !ok {
		return uuid.UUID{}, echo.NewHTTPError(http.StatusUnauthorized, "Invalid token claims")
	}
	userIDStr, ok := userClaims["sub"].(string)
	if !ok || userIDStr == "" {
		return uuid.UUID{}, echo.NewHTTPError(http.StatusUnauthorized, "Invalid user id in token")
	}
	user, err := dbQueries.GetUserByClerkID(ctx, userIDStr)
	if err != nil {
		return uuid.UUID{}, echo.NewHTTPError(http.StatusUnauthorized, err.Error())
	}
	return user.ID, nil
}

func GetUserByID(c echo.Context, ctx context.Context, db *sql.DB, dbQueries *database.Queries) error {
	_, err := validateUser(c, ctx, dbQueries)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": err.Error()})
	}

	idStr := c.Param("id")
	if idStr == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Missing user ID"})
	}
	userID, err := uuid.Parse(idStr)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid user ID format"})
	}

	user, err := dbQueries.GetUserByID(ctx, userID)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "User not found"})
	}
	return c.JSON(http.StatusOK, user)
}

func GetUserByClerkID(c echo.Context, ctx context.Context, db *sql.DB, dbQueries *database.Queries) error {
	_, err := validateUser(c, ctx, dbQueries)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": err.Error()})
	}

	clerkID := c.Param("clerk_id")
	if clerkID == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Missing clerk ID"})
	}
	user, err := dbQueries.GetUserByClerkID(ctx, clerkID)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "User not found"})
	}
	return c.JSON(http.StatusOK, user)
}

func GetUserByEmail(c echo.Context, ctx context.Context, db *sql.DB, dbQueries *database.Queries) error {
	_, err := validateUser(c, ctx, dbQueries)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": err.Error()})
	}

	email := c.Param("email")
	if email == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Missing email"})
	}

	user, err := dbQueries.GetUserByEmail(ctx, email)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "User not found"})
	}
	return c.JSON(http.StatusOK, user)
}

func GetUsers(c echo.Context, ctx context.Context, db *sql.DB, dbQueries *database.Queries) error {
	_, err := validateUser(c, ctx, dbQueries)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": err.Error()})
	}

	users, err := dbQueries.GetUsers(ctx)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error retrieving users"})
	}
	return c.JSON(http.StatusOK, users)
}
