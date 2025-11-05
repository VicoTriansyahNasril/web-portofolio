package cache

import (
	"context"
	"log"
	"time"

	"backend-portofolio/internal/config"
	"github.com/go-redis/redis/v8"
)

var Ctx = context.Background()
var Rdb *redis.Client

func Init(cfg config.Config) {
	opt, err := redis.ParseURL(cfg.RedisURL)
	if err != nil {
		log.Fatalf("Could not parse Redis URL: %v", err)
	}
	Rdb = redis.NewClient(opt)
	if err := Rdb.Ping(Ctx).Err(); err != nil {
		log.Fatalf("Could not connect to Redis: %v", err)
	}
	log.Println("Successfully connected to Redis.")
}

func Get(key string) (string, error) {
	return Rdb.Get(Ctx, key).Result()
}

func Set(key string, value interface{}, expiration time.Duration) error {
	return Rdb.Set(Ctx, key, value, expiration).Err()
}

func DelByPattern(pattern string) error {
	var cursor uint64
	var err error
	for {
		var keys []string
		keys, cursor, err = Rdb.Scan(Ctx, cursor, pattern, 100).Result()
		if err != nil {
			return err
		}
		if len(keys) > 0 {
			if err := Rdb.Del(Ctx, keys...).Err(); err != nil {
				log.Printf("Failed to delete keys: %v", err)
			}
		}
		if cursor == 0 {
			break
		}
	}
	return nil
}
