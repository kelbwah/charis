// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: initial_launch_emails.sql

package database

import (
	"context"

	"github.com/google/uuid"
)

const createLaunchEmailEntry = `-- name: CreateLaunchEmailEntry :one
INSERT INTO initial_launch_emails (id, email)
VALUES ($1, $2)
RETURNING id, email, created_at, updated_at
`

type CreateLaunchEmailEntryParams struct {
	ID    uuid.UUID
	Email string
}

func (q *Queries) CreateLaunchEmailEntry(ctx context.Context, arg CreateLaunchEmailEntryParams) (InitialLaunchEmail, error) {
	row := q.db.QueryRowContext(ctx, createLaunchEmailEntry, arg.ID, arg.Email)
	var i InitialLaunchEmail
	err := row.Scan(
		&i.ID,
		&i.Email,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getAllLaunchEmailEntries = `-- name: GetAllLaunchEmailEntries :many
SELECT id, email, created_at, updated_at FROM initial_launch_emails
`

func (q *Queries) GetAllLaunchEmailEntries(ctx context.Context) ([]InitialLaunchEmail, error) {
	rows, err := q.db.QueryContext(ctx, getAllLaunchEmailEntries)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []InitialLaunchEmail
	for rows.Next() {
		var i InitialLaunchEmail
		if err := rows.Scan(
			&i.ID,
			&i.Email,
			&i.CreatedAt,
			&i.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getLaunchEmailEntryByEmail = `-- name: GetLaunchEmailEntryByEmail :one
SELECT id, email, created_at, updated_at FROM initial_launch_emails
WHERE email = $1
`

func (q *Queries) GetLaunchEmailEntryByEmail(ctx context.Context, email string) (InitialLaunchEmail, error) {
	row := q.db.QueryRowContext(ctx, getLaunchEmailEntryByEmail, email)
	var i InitialLaunchEmail
	err := row.Scan(
		&i.ID,
		&i.Email,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getLaunchEmailEntryById = `-- name: GetLaunchEmailEntryById :one
SELECT id, email, created_at, updated_at FROM initial_launch_emails
WHERE id = $1
`

func (q *Queries) GetLaunchEmailEntryById(ctx context.Context, id uuid.UUID) (InitialLaunchEmail, error) {
	row := q.db.QueryRowContext(ctx, getLaunchEmailEntryById, id)
	var i InitialLaunchEmail
	err := row.Scan(
		&i.ID,
		&i.Email,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}
