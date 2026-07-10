package tests


import (
	"context"
)


func ResetDatabase(){


	DB.Exec(
		context.Background(),
		`
		TRUNCATE
		links,
		clicks
		RESTART IDENTITY CASCADE
		`,
	)

}