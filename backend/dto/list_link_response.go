package dto

type ListLinkResponse struct {
	ID string `json:"id"`

	Code string `json:"code"`

	OriginalURL string `json:"original_url"`

	Clicks int `json:"clicks"`

	CreatedAt string `json:"created_at"`
}
