-- name: CreatePrayerComment :one
INSERT INTO prayer_comments (id, prayer_id, comment, commenter_id, is_anonymous)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: GetPrayerCommentByID :one
SELECT * FROM prayer_comments
WHERE id = $1;

-- name: GetPrayerCommentsByPrayer :many
SELECT * FROM prayer_comments
WHERE prayer_id = $1
ORDER BY created_at ASC;

-- name: UpdatePrayerComment :one
UPDATE prayer_comments
SET comment = COALESCE($2, comment),
    updated_at = NOW()
WHERE id = $1
RETURNING *;

-- name: DeletePrayerComment :exec
DELETE FROM prayer_comments
WHERE id = $1;
