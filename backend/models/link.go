package models

import "time"


type Link struct {

	ID string `json:"id"`

	Code string `json:"code"`

	Alias *string `json:"alias,omitempty"`

	OriginalURL string `json:"original_url"`

	CreatedBy string `json:"created_by"`

	CreatedAt time.Time `json:"created_at"`

}