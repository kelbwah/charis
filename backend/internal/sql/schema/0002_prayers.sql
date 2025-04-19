-- +goose Up
CREATE TABLE IF NOT EXISTS prayers (
    id UUID PRIMARY KEY,
    prayer_title TEXT NOT NULL,
    prayer_request TEXT NOT NULL,
    category TEXT NOT NULL,
    related_scripture TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    is_anonymous BOOLEAN NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- +goose Down
DROP TABLE prayers;
