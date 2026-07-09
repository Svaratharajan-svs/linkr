package dto

type CreateLinkRequest struct {
	OriginalURL string `json:"original_url" binding:"required,url"`
	Alias       string `json:"alias"`
}
