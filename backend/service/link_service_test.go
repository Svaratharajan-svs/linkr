package service

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/Svaratharajan-svs/linkr/backend/config"
	"github.com/Svaratharajan-svs/linkr/backend/dto"
	"github.com/Svaratharajan-svs/linkr/backend/repository"
)

func TestCreateLink(t *testing.T) {

	repo := &repository.MockRepository{}

	cfg := &config.Config{
		BaseURL: "http://localhost:8080",
	}

	service := NewLinkService(repo, cfg)

	response, err := service.CreateLink(
		context.Background(),
		dto.CreateLinkRequest{
			OriginalURL: "https://google.com",
		},
		"admin",
	)

	assert.NoError(t, err)
	assert.NotNil(t, response)
	assert.NotEmpty(t, response.Code)
}
