package routes

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/kelbwah/charis/backend/internal/database"
	"github.com/labstack/echo/v4"
)

// SQL Query references:
//
// -- name: CreatePrayer :one
// INSERT INTO prayers (id, prayer_title, prayer_request, category, related_scripture, is_anonymous, user_id)
// VALUES ($1, $2, $3, $4, $5, $6, $7)
// RETURNING *;
//
// -- name: GetPrayerByID :one
// SELECT * FROM prayers
// WHERE id = $1;
//
// -- name: GetPrayersByUser :many
// SELECT * FROM prayers
// WHERE user_id = $1
// ORDER BY created_at DESC;
//
// -- name: GetAllPrayers :many
// SELECT * FROM prayers
// WHERE user_id != $1
// ORDER BY created_at DESC;
//
// -- name: GetAllPrayersWithFilter :many
// SELECT * FROM prayers
// WHERE user_id != $1
// AND category = $2
// ORDER BY created_at DESC;
//
// -- name: UpdatePrayer :one
// UPDATE prayers
// SET prayer_title = COALESCE($2, prayer_title),
//     prayer_request = COALESCE($3, prayer_request),
//     category = COALESCE($4, category),
//     related_scripture = COALESCE($5, related_scripture),
//     is_anonymous = COALESCE($6, is_anonymous),
//     updated_at = NOW()
// WHERE id = $1
// RETURNING *;
//
// -- name: DeletePrayer :exec
// DELETE FROM prayers
// WHERE id = $1;

// createPrayerPayload represents the JSON payload for creating a prayer.
type createPrayerPayload struct {
	PrayerTitle      string `json:"prayer_title"`
	PrayerRequest    string `json:"prayer_request"`
	Category         string `json:"category"`
	RelatedScripture string `json:"related_scripture"`
	IsAnonymous      bool   `json:"is_anonymous"`
}

// updatePrayerPayload represents the JSON payload for updating a prayer.
type updatePrayerPayload struct {
	PrayerTitle      string `json:"prayer_title"`
	PrayerRequest    string `json:"prayer_request"`
	Category         string `json:"category"`
	RelatedScripture string `json:"related_scripture"`
	IsAnonymous      bool   `json:"is_anonymous"`
}

// CreatePrayer creates a new prayer using the CreatePrayer SQL query.
func CreatePrayer(c echo.Context, ctx context.Context, db *sql.DB, dbQueries *database.Queries) error {
	log.Println("Creating prayer payload!")
	var payload createPrayerPayload
	if err := c.Bind(&payload); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid payload"})
	}
	log.Printf("Finished prayer payload: %+v\n", payload)

	// Validate the authenticated user.
	internalUserID, err := validateUser(c, ctx, dbQueries)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": err.Error()})
	}
	log.Printf("Retrieved internal userID: %v\n", internalUserID)

	// Prepare query parameters.
	params := database.CreatePrayerParams{
		ID:               uuid.New(),
		PrayerTitle:      payload.PrayerTitle,
		PrayerRequest:    payload.PrayerRequest,
		Category:         payload.Category,
		RelatedScripture: sql.NullString{String: payload.RelatedScripture, Valid: strings.TrimSpace(payload.RelatedScripture) != ""},
		IsAnonymous:      payload.IsAnonymous,
		UserID:           internalUserID,
	}
	log.Printf("Created CreatePrayerParams: %+v\n", params)

	// Insert the prayer.
	prayer, err := dbQueries.CreatePrayer(ctx, params)
	if err != nil {
		log.Println("Error creating prayer:", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error creating prayer"})
	}
	log.Println("Created prayer!")
	return c.JSON(http.StatusCreated, prayer)
}

// GetPrayerByID retrieves a prayer by its ID using the GetPrayerByID SQL query.
func GetPrayerByID(c echo.Context, ctx context.Context, db *sql.DB, dbQueries *database.Queries) error {
	// Validate the user (even if not used for ownership, we require authentication).
	_, err := validateUser(c, ctx, dbQueries)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": err.Error()})
	}

	prayerIDStr := c.Param("id")
	if prayerIDStr == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Missing prayer ID"})
	}
	prayerID, err := uuid.Parse(prayerIDStr)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid prayer ID format"})
	}

	prayer, err := dbQueries.GetPrayerByID(ctx, prayerID)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Prayer not found"})
	}
	return c.JSON(http.StatusOK, prayer)
}

// GetPrayerCountByID retrieves a prayer count by a specific prayer ID using the GetPrayerByID SQL query.
func GetPrayerCountByID(c echo.Context, ctx context.Context, db *sql.DB, dbQueries *database.Queries) error {
	// Validate the user (even if not used for ownership, we require authentication).
	_, err := validateUser(c, ctx, dbQueries)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": err.Error()})
	}

	prayerIDStr := c.Param("id")
	if prayerIDStr == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Missing prayer ID"})
	}
	prayerID, err := uuid.Parse(prayerIDStr)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid prayer ID format"})
	}

	prayerCounts, err := dbQueries.CountPrayerResponsesByPrayer(ctx, prayerID)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Prayer not found"})
	}
	return c.JSON(http.StatusOK, prayerCounts)
}

// GetPrayersByUser retrieves all prayers created by the authenticated user.
func GetPrayersByUser(c echo.Context, ctx context.Context, db *sql.DB, dbQueries *database.Queries) error {
	internalUserID, err := validateUser(c, ctx, dbQueries)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": err.Error()})
	}

	prayers, err := dbQueries.GetPrayersByUser(ctx, internalUserID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error retrieving prayers"})
	}
	return c.JSON(http.StatusOK, prayers)
}

// GetAllPrayers returns prayers from other users applying the anonymous, category,
// sort, and pagination (cursor/limit) filters.
func GetAllPrayers(c echo.Context, ctx context.Context, db *sql.DB, dbQueries *database.Queries) error {
	fmt.Println("here!")
	// Validate the user.
	internalUserID, err := validateUser(c, ctx, dbQueries)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": err.Error()})
	}

	limit := 20
	if limitParam := c.QueryParam("limit"); limitParam != "" {
		if l, err := strconv.Atoi(limitParam); err == nil && l > 0 {
			limit = l
		}
	}

	cursorParam := c.QueryParam("cursor")
	if cursorParam == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Missing required cursor parameter"})
	}
	cursor, err := time.Parse(time.RFC3339, cursorParam)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid cursor format, expecting RFC3339"})
	}

	category := c.QueryParam("category")

	sortBy := c.QueryParam("sort")
	if sortBy == "" {
		sortBy = "newest"
	} else if sortBy != "newest" && sortBy != "oldest" {
		sortBy = "newest"
	}

	showAnonymous := true
	if showAnonParam := c.QueryParam("show_anonymous"); showAnonParam != "" {
		if b, err := strconv.ParseBool(showAnonParam); err == nil {
			showAnonymous = b
		}
	}

	var prayers []database.Prayer
	if sortBy == "newest" {
		prayers, err = dbQueries.GetAllPrayersPaginatedNewest(ctx, database.GetAllPrayersPaginatedNewestParams{
			UserID:  internalUserID,
			Column2: showAnonymous,
			Column3: category,
			Column4: cursor,
			Limit:   int32(limit),
		})
	} else if sortBy == "oldest" {
		prayers, err = dbQueries.GetAllPrayersPaginatedOldest(ctx, database.GetAllPrayersPaginatedOldestParams{
			UserID:  internalUserID,
			Column2: showAnonymous,
			Column3: category,
			Column4: cursor,
			Limit:   int32(limit),
		})
	}

	if err != nil {
		fmt.Println(err.Error())
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error retrieving prayers"})
	}

	return c.JSON(http.StatusOK, prayers)
}

// UpdatePrayer updates an existing prayer.
// It verifies that the authenticated user is the owner before updating.
func UpdatePrayer(c echo.Context, ctx context.Context, db *sql.DB, dbQueries *database.Queries) error {
	internalUserID, err := validateUser(c, ctx, dbQueries)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": err.Error()})
	}

	prayerIDStr := c.Param("id")
	if prayerIDStr == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Missing prayer ID"})
	}
	prayerID, err := uuid.Parse(prayerIDStr)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid prayer ID format"})
	}

	// Retrieve the existing prayer to verify ownership.
	existingPrayer, err := dbQueries.GetPrayerByID(ctx, prayerID)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Prayer not found"})
	}
	if existingPrayer.UserID != internalUserID {
		return c.JSON(http.StatusForbidden, map[string]string{"error": "Not authorized to update this prayer"})
	}

	var payload updatePrayerPayload
	if err := c.Bind(&payload); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid payload"})
	}

	params := database.UpdatePrayerParams{
		ID:               prayerID,
		PrayerTitle:      payload.PrayerTitle,
		PrayerRequest:    payload.PrayerRequest,
		Category:         payload.Category,
		RelatedScripture: sql.NullString{String: payload.RelatedScripture, Valid: strings.TrimSpace(payload.RelatedScripture) != ""},
		IsAnonymous:      payload.IsAnonymous,
	}

	prayer, err := dbQueries.UpdatePrayer(ctx, params)
	if err != nil {
		fmt.Println(err.Error())
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error updating prayer"})
	}
	return c.JSON(http.StatusOK, prayer)
}

// DeletePrayer deletes an existing prayer.
// It verifies that the authenticated user is the owner before deletion.
func DeletePrayer(c echo.Context, ctx context.Context, db *sql.DB, dbQueries *database.Queries) error {
	internalUserID, err := validateUser(c, ctx, dbQueries)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": err.Error()})
	}

	prayerIDStr := c.Param("id")
	if prayerIDStr == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Missing prayer ID"})
	}
	prayerID, err := uuid.Parse(prayerIDStr)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid prayer ID format"})
	}

	// Retrieve the existing prayer to verify ownership.
	existingPrayer, err := dbQueries.GetPrayerByID(ctx, prayerID)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Prayer not found"})
	}
	if existingPrayer.UserID != internalUserID {
		return c.JSON(http.StatusForbidden, map[string]string{"error": "Not authorized to delete this prayer"})
	}

	params := database.DeletePrayerParams{
		ID:     prayerID,
		UserID: internalUserID,
	}

	if err := dbQueries.DeletePrayer(ctx, params); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error deleting prayer"})
	}
	return c.JSON(http.StatusOK, map[string]string{"deleted": "true"})
}
