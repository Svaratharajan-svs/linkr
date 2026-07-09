package repository

import (
	"context"

	"github.com/Svaratharajan-svs/linkr/backend/dto"
	"github.com/Svaratharajan-svs/linkr/backend/models"
)

type LinkRepository interface {
	Create(
		ctx context.Context,
		link *models.Link,
	) error

	FindByCode(
		ctx context.Context,
		code string,
	) (*models.Link, error)

	FindByAlias(
		ctx context.Context,
		alias string,
	) (*models.Link, error)

	List(
		ctx context.Context,
		limit int,
		offset int,
	) ([]models.Link, error)

	IncrementClick(
		ctx context.Context,
		linkID string,
	) error

	GetDailyStats(
		ctx context.Context,
		linkID string,
	) ([]dto.DailyStats, error)

	GetTotalClicks(
		ctx context.Context,
		linkID string,
	) (int, error)
}
