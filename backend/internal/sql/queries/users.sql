-- name: CreateUser :one
INSERT INTO users (id, email, password, username, biography)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: GetUserByID :one
SELECT * FROM users
WHERE id = $1;

-- name: GetUserByEmail :one
SELECT * FROM users
WHERE email = $1;

-- name: GetUserByUsername :one
SELECT * FROM users
WHERE username = $1;

-- name: GetUsers :many
SELECT * FROM users
ORDER BY created_at DESC;

-- name: UpdateUser :one
UPDATE users
SET email = COALESCE($2, email),
    password = COALESCE($3, password),
    username = COALESCE($4, username),
    biography = COALESCE($5, biography),
    updated_at = NOW()
WHERE id = $1
RETURNING *;

-- name: DeleteUser :exec
DELETE FROM users
WHERE id = $1;