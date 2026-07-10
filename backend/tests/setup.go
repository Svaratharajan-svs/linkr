package tests

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)


var DB *pgxpool.Pool


func SetupDatabase(){


	url :=
		os.Getenv(
			"TEST_DATABASE_URL",
		)


	if url == "" {

		url =
		"postgres://postgres:postgres@localhost:5433/linkr_test?sslmode=disable"

	}


	pool, err :=
		pgxpool.New(
			context.Background(),
			url,
		)


	if err != nil {

		log.Fatal(err)

	}


	DB = pool

}


func Cleanup(){

	if DB != nil {

		DB.Close()

	}

}