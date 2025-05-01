-- +goose Up
CREATE TABLE IF NOT EXISTS prayer_responses (
    id UUID PRIMARY KEY,
    prayer_id UUID NOT NULL REFERENCES prayers(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(10) NOT NULL CHECK (status IN ('will_pray', 'prayed_for', 'not_now')),
    hidden BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
-- +goose Down
DROP TABLE prayer_responses;
