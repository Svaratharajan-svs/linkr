package service

import (
	"context"
	"github.com/google/uuid"
	"time"

	"github.com/Svaratharajan-svs/linkr/backend/config"
	"github.com/Svaratharajan-svs/linkr/backend/dto"
	"github.com/Svaratharajan-svs/linkr/backend/models"
	"github.com/Svaratharajan-svs/linkr/backend/repository"
	"github.com/Svaratharajan-svs/linkr/backend/utils"
)

type LinkService struct {
	repository repository.LinkRepository
	cfg        *config.Config
}

func NewLinkService(repo repository.LinkRepository, cfg *config.Config) *LinkService {
	return &LinkService{
		repository: repo,
		cfg:        cfg,
	}
}

func (s *LinkService) CreateLink(
	ctx context.Context,
	req dto.CreateLinkRequest,
	userID string,
) (*dto.CreateLinkResponse, error) {

	if !utils.IsValidURL(req.OriginalURL) {
		return nil, utils.ErrInvalidURL
	}

	if req.Alias != "" {

		if !utils.IsValidAlias(req.Alias) {
			return nil, utils.ErrInvalidAlias
		}

		existing, err := s.repository.FindByAlias(
			ctx,
			req.Alias,
		)

		if err != nil {
			return nil, err
		}

		if existing != nil {
			return nil, utils.ErrAliasExists
		}
	}

	code := req.Alias

	if code == "" {

		var err error

		for i := 0; i < 5; i++ {

			code, err = utils.GenerateCode(6)

			if err != nil {
				return nil, utils.ErrCodeGeneration
			}

			existing, err := s.repository.FindByCode(
				ctx,
				code,
			)

			if err != nil {
				return nil, err
			}

			if existing == nil {
				break
			}

			if i == 4 {
				return nil, utils.ErrDuplicateCode
			}
		}
	}

	link := &models.Link{
		ID:          uuid.NewString(),
		Code:        code,
		OriginalURL: req.OriginalURL,
		CreatedBy:   userID,
	}

	if req.Alias != "" {
		link.Alias = &req.Alias
	}

	if err := s.repository.Create(ctx, link); err != nil {
		return nil, err
	}

	return &dto.CreateLinkResponse{
		ID:          link.ID,
		Code:        link.Code,
		ShortURL:    s.cfg.BaseURL + "/" + link.Code,
		OriginalURL: link.OriginalURL,
		CreatedAt:   link.CreatedAt.Format(time.RFC3339),
	}, nil
}

func (s *LinkService) ListLinks(
	ctx context.Context,
	page int,
	limit int,
) ([]models.Link, error) {

	offset := (page - 1) * limit

	return s.repository.List(
		ctx,
		limit,
		offset,
	)
}

func (s *LinkService) FindByCode(
	ctx context.Context,
	code string,
) (*models.Link, error) {

	return s.repository.FindByCode(
		ctx,
		code,
	)
}

func (s *LinkService) GetStats(
	ctx context.Context,
	linkID string,
) (*dto.StatsResponse, error) {

	total, err := s.repository.GetTotalClicks(ctx, linkID)
	if err != nil {
		return nil, err
	}

	daily, err := s.repository.GetDailyStats(ctx, linkID)
	if err != nil {
		return nil, err
	}

	return &dto.StatsResponse{
		TotalClicks: total,
		Daily:       daily,
	}, nil
}
