-- name: CreateLaunchEmailEntry :one
INSERT INTO initial_launch_emails (id, email)
VALUES ($1, $2)
RETURNING *;

-- name: GetLaunchEmailEntryById :one
SELECT * FROM initial_launch_emails
WHERE id = $1;

-- name: GetLaunchEmailEntryByEmail :one
SELECT * FROM initial_launch_emails
WHERE email = $1;

-- name: GetAllLaunchEmailEntries :many
SELECT * FROM initial_launch_emails;