package repository

import (
	"context"

	"github.com/Svaratharajan-svs/linkr/backend/dto"
	"github.com/Svaratharajan-svs/linkr/backend/models"
)

type MockRepository struct {
	CreateCalled bool

	Created *models.Link
	CountValue int
	CountError error
}

func (m *MockRepository) Create(
	ctx context.Context,
	link *models.Link,
) error {

	m.CreateCalled = true

	m.Created = link

	return nil
}

func (m *MockRepository) FindByCode(
	ctx context.Context,
	code string,
) (*models.Link, error) {

	return nil, nil
}

func (m *MockRepository) FindByAlias(
	ctx context.Context,
	alias string,
) (*models.Link, error) {

	return nil, nil
}

func (m *MockRepository) List(
	ctx context.Context,
	limit,
	offset int,
) ([]models.Link, error) {

	return []models.Link{}, nil
}

func (m *MockRepository) IncrementClick(ctx context.Context, linkID string) error {
	return nil
}

func (m *MockRepository) GetTotalClicks(
	ctx context.Context,
	linkID string,
) (int, error) {

	return 0, nil
}

func (m *MockRepository) GetDailyStats(
	ctx context.Context,
	linkID string,
) ([]dto.DailyStats, error) {

	return []dto.DailyStats{}, nil
}

func (m *MockRepository) Count(
	ctx context.Context,
) (int, error) {

	return 0, nil
}