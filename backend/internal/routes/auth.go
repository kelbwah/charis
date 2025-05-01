package routes

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
	"github.com/kelbwah/charis/backend/internal/database"
	"github.com/kelbwah/charis/backend/internal/utils"
	"github.com/labstack/echo/v4"
)

// registerPayload represents the JSON payload for creating a user.
type registerPayload struct {
	Email     string `json:"email" validate:"required,email"`
	Password  string `json:"password" validate:"required,min=8"`
	Biography string `json:"biography" validate:"required,required,min=3,max=150"`
	Username  string `json:"username" validate:"required,alphanum,min=3,max=18"`
}

// loginPayload represents the JSON payload for logging in.
type loginPayload struct {
	Email    string `json:"email" validate:"required"`
	Password string `json:"password" validate:"required,min=8"`
}

type authResponse struct {
	UserID string `json:"user_id"`
}

type errorResponse struct {
	Error string `json:"error"`
}

type tokenResponse struct {
	AccessToken string `json:"access_token"`
}

func RegisterHandler(c echo.Context, ctx context.Context, db *sql.DB, dbQueries *database.Queries) error {
	var payload registerPayload
	if err := c.Bind(&payload); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid payload"})
	}
	if err := utils.Validate.Struct(&payload); err != nil {
		errs := err.(validator.ValidationErrors)
		out := make(map[string]string, len(errs))
		for _, fe := range errs {
			out[fe.Field()] = fmt.Sprintf("failed on '%s' rule", fe.Tag())
		}
		return c.JSON(http.StatusBadRequest, out)
	}

	// Hash password
	hashedPassword, err := utils.HashPassword(payload.Password)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Internal Server Error. Please try again later."})
	}

	// Creating user
	newId := uuid.New()
	params := database.CreateUserParams{
		ID:        newId,
		Email:     payload.Email,
		Password:  hashedPassword,
		Biography: payload.Biography,
		Username:  payload.Username,
	}

	_, err = dbQueries.CreateUser(ctx, params)
	if err != nil {
		log.Printf("Error while creating new user: %v\n", err.Error())
		return err
	}

	// issuing tokens
	accessToken, err := utils.GenerateJWT(newId.String(), 15*time.Minute, "access")
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "couldn't generate access token"})
	}

	refreshToken, err := utils.GenerateJWT(newId.String(), 7*24*time.Hour, "refresh")
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "couldn't generate refresh token"})
	}

	setCookie := func(name, val string, ttl time.Duration) {
		c.SetCookie(&http.Cookie{
			Name:     name,
			Value:    val,
			Path:     "/",
			Expires:  time.Now().Add(ttl),
			HttpOnly: true,
			Secure:   true,
			SameSite: http.SameSiteStrictMode,
		})
	}
	setCookie("access_token", accessToken, 15*time.Minute)
	setCookie("refresh_token", refreshToken, 7*24*time.Hour)

	return c.JSON(http.StatusCreated, authResponse{UserID: newId.String()})
}

func LoginHandler(c echo.Context, ctx context.Context, db *sql.DB, dbQueries *database.Queries) error {
	var payload loginPayload
	if err := c.Bind(&payload); err != nil {
		log.Printf("Error caught: %v\n\n", err.Error())
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid payload"})
	}
	if err := utils.Validate.Struct(&payload); err != nil {
		errs := err.(validator.ValidationErrors)
		out := make(map[string]string, len(errs))
		for _, fe := range errs {
			out[fe.Field()] = fmt.Sprintf("failed on '%s' rule", fe.Tag())
		}
		return c.JSON(http.StatusBadRequest, out)
	}

	// Fetch user by email or username
	var (
		foundUser    database.User
		fetchUserErr error
	)
	if len(payload.Email) > 0 {
		foundUser, fetchUserErr = dbQueries.GetUserByEmail(ctx, payload.Email)
	} else {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid payload: Email must be included."})
	}

	// Handling any errors caught while fetching user information
	if fetchUserErr == sql.ErrNoRows {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "User not found."})
	} else if fetchUserErr != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error while fetching user information, please try again later."})
	}

	if !utils.VerifyPassword(payload.Password, foundUser.Password) {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid credentials."})
	}

	accessToken, err := utils.GenerateJWT(foundUser.ID.String(), 15*time.Minute, "access")
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "couldn't generate access token"})
	}

	refreshToken, err := utils.GenerateJWT(foundUser.ID.String(), 7*24*time.Hour, "refresh")
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "couldn't generate refresh token"})
	}

	setCookie := func(name, val string, ttl time.Duration) {
		c.SetCookie(&http.Cookie{
			Name:     name,
			Value:    val,
			Path:     "/",
			Expires:  time.Now().Add(ttl),
			HttpOnly: true,
			Secure:   true,
			SameSite: http.SameSiteStrictMode,
		})
	}
	setCookie("access_token", accessToken, 15*time.Minute)
	setCookie("refresh_token", refreshToken, 7*24*time.Hour)

	return c.JSON(http.StatusOK, authResponse{UserID: foundUser.ID.String()})
}

func LogoutHandler(c echo.Context) error {
	// expire both refresh and access token cookies
	expired := time.Now().Add(-time.Hour)
	for _, name := range []string{"access_token", "refresh_token"} {
		c.SetCookie(&http.Cookie{
			Name:     name,
			Value:    "",
			Path:     "/",
			Expires:  expired,
			MaxAge:   -1,
			HttpOnly: true,
			Secure:   true,
			SameSite: http.SameSiteStrictMode,
		})
	}

	return c.JSON(http.StatusOK, map[string]string{"successful": "true"})
}

func RefreshTokenHandler(c echo.Context) error {
	cookie, err := c.Cookie("refresh_token")
	if err != nil {
		log.Printf("%v\n", err.Error())
		log.Printf("\n\n1. missing refresh token!\n\n")
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "missing refresh token"})
	}
	tok, err := jwt.Parse(cookie.Value, func(t *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	if err != nil || !tok.Valid {
		log.Printf("\n\n2. invalid refresh token\n\n")
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "invalid refresh token"})
	}
	claims := tok.Claims.(jwt.MapClaims)
	if claims["type"] != "refresh" {
		log.Printf("\n\n3. wrong token type\n\n")
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "wrong token type"})
	}
	if float64(time.Now().Unix()) > claims["exp"].(float64) {
		log.Printf("\n\n4. refresh token expired\n\n")
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "refresh token expired"})
	}

	userID := claims["sub"].(string)
	access, err := utils.GenerateJWT(userID, 15*time.Minute, "access")
	if err != nil {
		log.Printf("\n\n5. couldn't generate access token\n\n")
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "couldn't generate access token"})
	}
	// rotate refresh if you like, or reuse the same:
	c.SetCookie(&http.Cookie{
		Name:     "access_token",
		Value:    access,
		Path:     "/",
		Expires:  time.Now().Add(15 * time.Minute),
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
	})

	return c.JSON(http.StatusOK, map[string]string{"access_token": access})
}
