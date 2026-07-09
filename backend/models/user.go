package models

import "time"

type User struct {
	ID string

	Email string

	Role string

	CreatedAt time.Time
}
