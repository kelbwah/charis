package pubsub

import "context"

type Publisher interface {
	Publish(channel string, data []byte) error
}

type Subscriber interface {
	Subscribe(ctx context.Context, channel string, handler func([]byte)) error
}
