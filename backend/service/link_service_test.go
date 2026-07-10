package service

import (
	"context"
	"testing"

	"github.com/Svaratharajan-svs/linkr/backend/config"
	"github.com/Svaratharajan-svs/linkr/backend/dto"
	"github.com/Svaratharajan-svs/linkr/backend/models"
	"github.com/Svaratharajan-svs/linkr/backend/repository"
)
type AliasExistsRepo struct {
	repository.MockRepository
}
func TestCreateLinkSuccess(t *testing.T) {

	repo := &repository.MockRepository{}

	cfg := &config.Config{
		BaseURL: "http://localhost:8080",
	}

	service := NewLinkService(
		repo,
		cfg,
	)

	request := dto.CreateLinkRequest{

		OriginalURL: "https://google.com",

	}

	response, err := service.CreateLink(

		context.Background(),

		request,

		"admin",

	)

	if err != nil {

		t.Fatal(err)

	}

	if response == nil {

		t.Fatal("response nil")

	}

	if !repo.CreateCalled {

		t.Fatal("Create not called")

	}

	if repo.Created == nil {

		t.Fatal("link not saved")

	}

	if repo.Created.OriginalURL != "https://google.com" {

		t.Fatal("url mismatch")

	}

	if repo.Created.CreatedBy != "admin" {

		t.Fatal("created by mismatch")

	}

	if repo.Created.Code == "" {

		t.Fatal("code not generated")

	}

}


func (m *AliasExistsRepo) FindByAlias(
	ctx context.Context,
	alias string,
) (*models.Link, error) {

	return &models.Link{

		Code: alias,

	}, nil
}

func TestAliasAlreadyExists(t *testing.T) {

	repo := &AliasExistsRepo{}

	cfg := &config.Config{}

	service := NewLinkService(
		repo,
		cfg,
	)

	request := dto.CreateLinkRequest{

		OriginalURL: "https://google.com",

		Alias: "google",

	}

	_, err := service.CreateLink(

		context.Background(),

		request,

		"admin",

	)

	if err == nil {

		t.Fatal("expected alias exists error")

	}

}

