-- name: CreatePrayerResponse :one
INSERT INTO prayer_responses (id, prayer_id, user_id, status)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetPrayerResponseByUserAndPrayer :one
SELECT * FROM prayer_responses
WHERE prayer_id = $1 AND user_id = $2;

-- name: GetPrayerResponsesByPrayer :many
SELECT * FROM prayer_responses
WHERE prayer_id = $1
ORDER BY created_at ASC;

-- name: GetPrayerResponsesByUser :many
SELECT * FROM prayer_responses
WHERE user_id = $1 AND hidden = false
ORDER BY created_at DESC;

-- name: GetWillPrayForResponsesByUser :many
SELECT * FROM prayers a 
LEFT JOIN prayer_responses b 
ON a.id = b.prayer_id
WHERE b.user_id = $1
AND b.status IN ('will_pray')
AND b.hidden = false
ORDER BY a.created_at DESC;

-- name: UpdatePrayerResponseStatus :exec
UPDATE prayer_responses
SET status = COALESCE($3, status),
    updated_at = NOW()
WHERE prayer_id = $1 and user_id = $2;

-- name: HidePrayerResponse :one
UPDATE prayer_responses
SET hidden = true,
    updated_at = NOW()
WHERE id = $1
RETURNING *;

-- name: CountPrayerResponsesByPrayer :one
SELECT 
    COUNT(*) FILTER (WHERE status = 'will_pray') AS will_pray_count,
    COUNT(*) FILTER (WHERE status = 'prayed_for') AS prayed_for_count
FROM prayer_responses
WHERE prayer_id = $1;