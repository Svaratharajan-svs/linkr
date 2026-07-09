package db

import (
	"context"
	"log"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

func New(databaseURL string) *pgxpool.Pool {

	var pool *pgxpool.Pool
	var err error

	for i := 1; i <= 10; i++ {

		log.Printf("Connecting to PostgreSQL (attempt %d)...", i)

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)

		pool, err = pgxpool.New(ctx, databaseURL)

		if err == nil {

			err = pool.Ping(ctx)

			if err == nil {

				cancel()

				log.Println("Connected to PostgreSQL")

				return pool
			}
		}

		cancel()

		log.Println(err)

		time.Sleep(3 * time.Second)
	}

	log.Fatal("Unable to connect to PostgreSQL")

	return nil
}
