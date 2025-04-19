package pubsub

import (
	"context"

	"github.com/redis/go-redis/v9"
)

type RedisPubSub struct {
	client *redis.Client
}

func NewRedisPubSub(client *redis.Client) *RedisPubSub {
	return &RedisPubSub{client: client}
}

func (r *RedisPubSub) Publish(channel string, data []byte) error {
	return r.client.Publish(context.Background(), channel, data).Err()
}

func (r *RedisPubSub) Subscribe(ctx context.Context, channel string, handler func([]byte)) error {
	sub := r.client.Subscribe(ctx, channel)
	ch := sub.Channel()

	go func() {
		for msg := range ch {
			handler([]byte(msg.Payload))
		}
	}()
	return nil
}
