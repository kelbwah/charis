-- name: CreateUser :one
INSERT INTO users (id, clerk_id, avatar_src, email, username)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: GetUserByID :one
SELECT * FROM users
WHERE id = $1;

-- name: GetUserByClerkID :one
SELECT * FROM users
WHERE clerk_id = $1;

-- name: GetUserByEmail :one
SELECT * FROM users
WHERE email = $1;

-- name: GetUsers :many
SELECT * FROM users
ORDER BY created_at DESC;

-- name: UpdateUser :exec
UPDATE users
SET avatar_src = COALESCE($2, avatar_src),
    email = COALESCE($3, email),
    username = COALESCE($4, username),
    updated_at = NOW()
WHERE clerk_id = $1;

-- name: DeleteUser :exec
DELETE FROM users
WHERE id = $1;

-- name: DeleteUserByClerkID :exec
DELETE FROM users
WHERE clerk_id = $1;