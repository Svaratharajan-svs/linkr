package dto

type CreateLinkResponse struct {
	ID string `json:"id"`

	Code string `json:"code"`

	ShortURL string `json:"short_url"`

	OriginalURL string `json:"original_url"`

	CreatedAt string `json:"created_at"`
}