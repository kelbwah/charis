package routes

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/google/uuid"
	"github.com/kelbwah/charis/backend/internal/database"
	"github.com/labstack/echo/v4"
)

func GetPrayerResponses(c echo.Context, ctx context.Context, db *sql.DB, dbQueries *database.Queries) error {
	// Validate the authenticated user.
	internalUserID, err := validateUser(c, ctx, dbQueries)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": err.Error()})
	}
	log.Printf("Retrieved internal userID: %v\n", internalUserID)

	// Insert the prayer response.
	willPrayForResponses, err := dbQueries.GetWillPrayForResponsesByUser(ctx, internalUserID)
	if err != nil {
		log.Println("Error getting will_pray for responses:", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error fetching will_pray for responses."})
	}
	fmt.Printf("%v\n", willPrayForResponses)
	log.Println("Got prayer responses!")
	return c.JSON(http.StatusCreated, willPrayForResponses)
}

func CreatePrayerResponse(c echo.Context, ctx context.Context, db *sql.DB, dbQueries *database.Queries) error {
	status := c.QueryParam("status")
	if strings.TrimSpace(status) == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "'status' must be included in query params."})
	}

	prayerIDStr := c.Param("id")
	if prayerIDStr == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Missing prayer ID"})
	}

	prayerID, err := uuid.Parse(prayerIDStr)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid prayer ID format"})
	}

	// Validate the authenticated user.
	internalUserID, err := validateUser(c, ctx, dbQueries)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": err.Error()})
	}
	log.Printf("Retrieved internal userID: %v\n", internalUserID)

	// Prepare query parameters.
	params := database.CreatePrayerResponseParams{
		ID:       uuid.New(),
		PrayerID: prayerID,
		UserID:   internalUserID,
		Status:   status,
	}
	log.Printf("Created CreatedPrayerResponse: %+v\n", params)

	// Insert the prayer response.
	prayerResponse, err := dbQueries.CreatePrayerResponse(ctx, params)
	if err != nil {
		log.Println("Error creating prayer response:", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error creating prayer response."})
	}
	log.Println("Created prayer response!")
	return c.JSON(http.StatusCreated, prayerResponse)
}

func UpdatePrayerResponse(c echo.Context, ctx context.Context, db *sql.DB, dbQueries *database.Queries) error {
	status := c.QueryParam("status")
	if strings.TrimSpace(status) == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "'status' must be included in query params."})
	}

	prayerIDStr := c.Param("id")
	if prayerIDStr == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Missing prayer ID"})
	}

	prayerID, err := uuid.Parse(prayerIDStr)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid prayer ID format"})
	}

	// Validate the authenticated user.
	internalUserID, err := validateUser(c, ctx, dbQueries)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": err.Error()})
	}
	log.Printf("Retrieved internal userID: %v\n", internalUserID)

	// Prepare query parameters.
	params := database.UpdatePrayerResponseStatusParams{
		PrayerID: prayerID,
		UserID:   internalUserID,
		Status:   status,
	}
	log.Printf("Created UpdatePrayerResponseStatusParams: %+v\n", params)

	// Updating the prayer response.
	err = dbQueries.UpdatePrayerResponseStatus(ctx, params)
	if err != nil {
		log.Println("Error updating prayer response:", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error updating prayer response."})
	}
	log.Println("Updated prayer response!")
	return c.JSON(http.StatusCreated, map[string]string{"updated": "true"})
}
