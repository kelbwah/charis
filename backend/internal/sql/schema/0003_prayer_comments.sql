-- +goose Up
CREATE TABLE IF NOT EXISTS prayer_comments (
    id UUID PRIMARY KEY,
    prayer_id UUID NOT NULL REFERENCES prayers(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    commenter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_anonymous BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- +goose Down
DROP TABLE prayer_comments;
