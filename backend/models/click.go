package models

import "time"

type Click struct {

	ID int64

	LinkID string

	ClickedAt time.Time

}