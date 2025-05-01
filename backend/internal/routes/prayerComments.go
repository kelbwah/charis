package routes

import (
	"context"
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/kelbwah/charis/backend/internal/database"
	"github.com/kelbwah/charis/backend/internal/pubsub"
	"github.com/labstack/echo/v4"
	"github.com/redis/go-redis/v9"
)

// RecvMessagePayload is the expected incoming message payload from the WebSocket client.
type RecvMessagePayload struct {
	PrayerID uuid.UUID `json:"prayer_id"`
	Comment  string    `json:"comment"`
	SenderID uuid.UUID `json:"sender_id"`
}

// SendMessagePayload is used to send errors or messages back to the client.
type SendMessagePayload struct {
	Error string `json:"error,omitempty"`
}

// Helper: send error message over the WebSocket.
func sendPrayerCommentsWSError(conn *websocket.Conn, err error) {
	log.Printf("Error: %v\n", err.Error())
	conn.WriteJSON(SendMessagePayload{
		Error: err.Error(),
	})
}

// PrayerCommentsWSHandler handles WebSocket connections for live prayer comment updates.
// func PrayerCommentsWSHandler(
// 	upgrader websocket.Upgrader, c echo.Context, ctx context.Context,
// 	db *sql.DB, queries *database.Queries, rdb *redis.Client,
// ) error {
// 	// Upgrade the connection to WebSocket.
// 	conn, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
// 	if err != nil {
// 		log.Println("WebSocket upgrade failed:", err)
// 		return err
// 	}
// 	defer conn.Close()

// 	// Validate that the user is authenticated and get internal user ID.
// 	internalUserId, err := validateUser(c, ctx, queries)
// 	if err != nil {
// 		sendPrayerCommentsWSError(conn, err)
// 		return err
// 	}

// 	// Retrieve and validate the prayer ID.
// 	prayerIDStr := c.Param("id")
// 	if prayerIDStr == "" {
// 		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Missing prayer ID"})
// 	}
// 	prayerID, err := uuid.Parse(prayerIDStr)
// 	if err != nil {
// 		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid prayer ID format"})
// 	}

// 	// Optionally, verify that the user has access/owns the prayer.
// 	getPrayerByIdAndUserParams := database.GetPrayerByIdAndUserParams{
// 		ID:     prayerID,
// 		UserID: internalUserId,
// 	}
// 	if _, err = queries.GetPrayerByIdAndUser(ctx, getPrayerByIdAndUserParams); err != nil {
// 		sendPrayerCommentsWSError(conn, err)
// 		return err
// 	}

// 	// Initialize the Redis pubsub mechanism.
// 	redisPubSub := pubsub.NewRedisPubSub(rdb)
// 	channelName := "prayer:" + prayerID.String() + ":comments"

// 	// Subscribe to the Redis channel to get live updates.
// 	err = redisPubSub.Subscribe(ctx, channelName, func(data []byte) {
// 		var commentMsg database.PrayerComment
// 		if err := json.Unmarshal(data, &commentMsg); err != nil {
// 			log.Println("Error unmarshaling comment from pubsub:", err)
// 			return
// 		}
// 		if err := conn.WriteJSON(commentMsg); err != nil {
// 			log.Println("Error writing JSON to WebSocket:", err)
// 		}
// 	})
// 	if err != nil {
// 		sendPrayerCommentsWSError(conn, err)
// 		return err
// 	}

// 	// Listen for incoming messages on the WebSocket from the client.
// 	// These will represent new prayer comments.
// 	go func() {
// 		for {
// 			var recvPayload RecvMessagePayload
// 			if err := conn.ReadJSON(&recvPayload); err != nil {
// 				log.Println("Error reading JSON from WebSocket:", err)
// 				break
// 			}

// 			commentID := uuid.New()
// 			newComment, err := queries.CreatePrayerComment(ctx, database.CreatePrayerCommentParams{
// 				ID:       commentID,
// 				PrayerID: prayerID,
// 				Comment:  recvPayload.Comment,
// 				CommenterID: uuid.NullUUID{
// 					UUID:  recvPayload.SenderID,
// 					Valid: strings.TrimSpace(recvPayload.SenderID.String()) != "",
// 				},
// 			})
// 			if err != nil {
// 				sendPrayerCommentsWSError(conn, err)
// 				continue
// 			}

// 			jsonData, err := json.Marshal(newComment)
// 			if err != nil {
// 				log.Println("Error marshaling new comment:", err)
// 				continue
// 			}

// 			if err := redisPubSub.Publish(channelName, jsonData); err != nil {
// 				log.Println("Error publishing new comment:", err)
// 				continue
// 			}
// 		}
// 	}()

// 	return nil
// }

type CreatePrayerCommentPayload struct {
	Comment     string `json:"comment"`
	IsAnonymous bool   `json:"is_anonymous"`
}

func CreatePrayerComment(c echo.Context, ctx context.Context, db *sql.DB, dbQueries *database.Queries, rdb *redis.Client) error {
	var payload CreatePrayerCommentPayload
	if err := c.Bind(&payload); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid payload"})
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
	internalUserID := uuid.New()

	// Check: Prevent author from sending themselves a comment on a prayer request they made
	originalPrayerInfo, err := dbQueries.GetPrayerByID(ctx, prayerID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error fetching original prayer information."})
	}

	// Prepare query parameters.
	params := database.CreatePrayerCommentParams{
		ID:          uuid.New(),
		PrayerID:    prayerID,
		CommenterID: internalUserID,
		Comment:     payload.Comment,
		IsAnonymous: payload.IsAnonymous,
	}

	if originalPrayerInfo.UserID == internalUserID {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Prayer author canot leave comment on their own prayer request."})
	}

	// Insert the prayer response.
	prayerCommentResponse, err := dbQueries.CreatePrayerComment(ctx, params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error creating comment."})
	}

	prayerCommentResponseJSON, err := json.Marshal(prayerCommentResponse)
	if err != nil {
		log.Println("Warning: Unable to marshal created row to JSON format.")
	}

	psChannelName := "prayer:" + prayerIDStr + ":comments"
	redisPubSub := pubsub.NewRedisPubSub(rdb)
	err = redisPubSub.Publish(psChannelName, prayerCommentResponseJSON)
	if err != nil {
		log.Printf("Warning: Unable to publish to pubsub channel:%v\n", err.Error())
	}

	return c.JSON(http.StatusCreated, prayerCommentResponse)
}
