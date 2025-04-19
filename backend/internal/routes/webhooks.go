package routes

import (
	"context"
	"database/sql"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/kelbwah/charis/backend/internal/database"
	"github.com/labstack/echo/v4"
	svix "github.com/svix/svix-webhooks/go"
)

type WebhookEvent struct {
	Type string                 `json:"type"`
	Data map[string]interface{} `json:"data"`
}

func ClerkWebhookHandler(c echo.Context, ctx context.Context, db *sql.DB, queries *database.Queries) error {
	log.Println("Received webhook request from Clerk/Svix")

	// Get the signing secret from environment variables.
	signingSecret := os.Getenv("SIGNING_SECRET")
	if signingSecret == "" {
		log.Println("SIGNING_SECRET is missing from environment")
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Missing SIGNING_SECRET"})
	}
	log.Println("SIGNING_SECRET found, initializing Svix webhook instance")

	// Create a new Svix Webhook instance.
	wh, err := svix.NewWebhook(signingSecret)
	if err != nil {
		log.Printf("Error creating Svix webhook instance: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Webhook initialization failed"})
	}
	log.Println("Svix webhook instance created successfully")

	// Extract required headers from the request.
	headersMap := http.Header{}
	svixID := c.Request().Header.Get("svix-id")
	svixTimestamp := c.Request().Header.Get("svix-timestamp")
	svixSignature := c.Request().Header.Get("svix-signature")
	headersMap.Set("svix-id", svixID)
	headersMap.Set("svix-timestamp", svixTimestamp)
	headersMap.Set("svix-signature", svixSignature)
	log.Printf("Extracted headers - svix-id: %s, svix-timestamp: %s, svix-signature: %s", svixID, svixTimestamp, svixSignature)

	// Check that the required headers are present.
	if svixID == "" || svixTimestamp == "" || svixSignature == "" {
		log.Println("One or more required Svix headers are missing")
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Missing Svix headers"})
	}

	// Read the request body.
	bodyBytes, err := io.ReadAll(c.Request().Body)
	if err != nil {
		log.Printf("Error reading request body: %v", err)
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Unable to read request body"})
	}
	log.Printf("Request body read successfully (%d bytes)", len(bodyBytes))

	// Verify the webhook payload using Svix.
	if err := wh.Verify(bodyBytes, headersMap); err != nil {
		log.Printf("Webhook verification failed: %v", err)
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Webhook verification failed"})
	}
	log.Println("Webhook verification succeeded")

	// Unmarshal the verified payload into our event structure.
	var evt WebhookEvent
	if err := json.Unmarshal(bodyBytes, &evt); err != nil {
		log.Printf("Error parsing webhook event JSON: %v", err)
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Failed to parse event"})
	}
	log.Printf("Webhook event parsed successfully. Event type: %s", evt.Type)

	// Log the event data for debugging purposes.
	eventData, err := json.MarshalIndent(evt.Data, "", "  ")
	if err == nil {
		log.Printf("Event data: %s", string(eventData))
	} else {
		log.Printf("Error marshaling event data: %v", err)
	}

	// Process the event based on its type.
	switch evt.Type {
	case "user.created":
		log.Println("Processing 'user.created' event")
		if err := CreateUser(c, ctx, db, queries, evt.Data); err != nil {
			log.Printf("Error processing 'user.created' event: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error processing user.created event"})
		}
	case "user.deleted":
		log.Println("Processing 'user.deleted' event")
		if err := DeleteUser(c, ctx, db, queries, evt.Data); err != nil {
			log.Printf("Error processing 'user.deleted' event: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error processing user.deleted event"})
		}
	case "user.updated":
		log.Println("Processing 'user.updated' event")
		if err := UpdateUser(c, ctx, db, queries, evt.Data); err != nil {
			log.Printf("Error processing 'user.updated' event: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error processing user.updated event"})
		}
	default:
		log.Printf("Unhandled event type: %s", evt.Type)
	}

	log.Println("Webhook event processed successfully")
	return c.String(http.StatusOK, "Webhook received")
}
