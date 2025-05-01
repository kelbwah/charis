-- +goose Up
CREATE TABLE IF NOT EXISTS prayers (
    id UUID PRIMARY KEY,
    prayer_title VARCHAR(75) NOT NULL,
    prayer_request VARCHAR(1000) NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Health', 'Family', 'Financial', 'Spiritual', 'Work', 'Relationships')),
    related_scripture TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    is_anonymous BOOLEAN NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- +goose Down
DROP TABLE prayers;
