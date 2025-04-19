-- name: CreatePrayer :one
INSERT INTO prayers (id, prayer_title, prayer_request, category, related_scripture, is_anonymous, user_id)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;

-- name: GetPrayerByID :one
SELECT * FROM prayers
WHERE id = $1;

-- name: GetPrayersByUser :many
SELECT * FROM prayers
WHERE user_id = $1
ORDER BY created_at DESC;

-- name: GetPrayerByIdAndUser :many
SELECT * FROM prayers
WHERE id = $1 AND user_id = $2
ORDER BY created_at DESC;

-- name: GetAllPrayersPaginatedNewest :many
SELECT
    a.id,
    a.prayer_title,
    a.prayer_request,
    a.category,
    a.related_scripture,
    a.created_at,
    a.updated_at,
    a.is_anonymous,
    a.user_id
FROM prayers a
LEFT JOIN prayer_responses b 
  ON a.id = b.prayer_id AND b.user_id = $1
WHERE a.user_id != $1 
  AND b.id IS NULL
  AND ($2::boolean OR a.is_anonymous = false)
  AND (COALESCE($3::text, '') = '' OR a.category ILIKE $3::text)
  AND a.created_at < $4::timestamptz
ORDER BY a.created_at DESC
LIMIT $5;

-- name: GetAllPrayersPaginatedOldest :many
SELECT 
    a.id,
    a.prayer_title,
    a.prayer_request,
    a.category,
    a.related_scripture,
    a.created_at,
    a.updated_at,
    a.is_anonymous,
    a.user_id
FROM prayers a
LEFT JOIN prayer_responses b 
  ON a.id = b.prayer_id AND b.user_id = $1
WHERE a.user_id != $1
  AND b.id IS NULL
  AND ($2::boolean OR a.is_anonymous = false)
  AND (COALESCE($3::text, '') = '' OR a.category ILIKE $3::text)
  AND a.created_at > $4::timestamptz
ORDER BY a.created_at ASC
LIMIT $5;

-- name: GetAllPrayers :many
SELECT * FROM prayers a
LEFT JOIN prayer_responses b 
ON a.id = b.prayer_id AND b.user_id = $1
WHERE a.user_id != $1
    AND b.id IS NULL
ORDER BY a.created_at DESC;

-- name: GetAllPrayersWithFilter :many
SELECT * FROM prayers a
LEFT JOIN prayer_responses b 
ON a.id = b.prayer_id AND b.user_id = $1
WHERE a.user_id != $1 
    AND a.category ILIKE $2
    AND b.id IS NULL
ORDER BY a.created_at DESC;

-- name: UpdatePrayer :one
UPDATE prayers
SET prayer_title = COALESCE($2, prayer_title),
    prayer_request = COALESCE($3, prayer_request),
    category = COALESCE($4, category),
    related_scripture = COALESCE($5, related_scripture),
    is_anonymous = COALESCE($6, is_anonymous),
    updated_at = NOW()
WHERE id = $1
RETURNING *;

-- name: DeletePrayer :exec
DELETE FROM prayers
WHERE id = $1 AND user_id = $2;
