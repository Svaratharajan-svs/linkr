package dto

type PaginationResponse struct {
	Page int `json:"page"`

	Limit int `json:"limit"`

	Items interface{} `json:"items"`
}
