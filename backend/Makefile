# --- Loading .env vars ---
ifneq (,$(wildcard ./.env))
    include .env
    export
endif

# --- Make targets ---
.PHONY: db-up db-down

live-dev:
	@air

test:
	@go test -v ./...

run:
	go run cmd/main.go

db-up:
	@cd internal/sql/schema && goose postgres $(DATABASE_URL) up

db-down:
	@cd internal/sql/schema && goose postgres $(DATABASE_URL) down
