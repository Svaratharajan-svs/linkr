package repository

import (
	"context"

	"github.com/Svaratharajan-svs/linkr/backend/dto"
	"github.com/Svaratharajan-svs/linkr/backend/models"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"time"
)

type PostgresLinkRepository struct {
	db *pgxpool.Pool
}

func NewPostgresLinkRepository(

	db *pgxpool.Pool,

) *PostgresLinkRepository {

	return &PostgresLinkRepository{

		db: db,
	}

}

func (r *PostgresLinkRepository) Create(
	ctx context.Context,
	link *models.Link,
) error {

	query := `
	INSERT INTO links
	(
		id,
		code,
		alias,
		original_url,
		created_by
	)
	VALUES
	($1,$2,$3,$4,$5)
	`

	_, err := r.db.Exec(
		ctx,
		query,
		link.ID,
		link.Code,
		link.Alias,
		link.OriginalURL,
		link.CreatedBy,
	)

	return err
}

func (r *PostgresLinkRepository) FindByCode(
	ctx context.Context,
	code string,
) (*models.Link, error) {

	query := `
	SELECT
		id,
		code,
		alias,
		original_url,
		created_by,
		created_at
	FROM links
	WHERE code=$1
	`

	var link models.Link

	err := r.db.QueryRow(
		ctx,
		query,
		code,
	).Scan(
		&link.ID,
		&link.Code,
		&link.Alias,
		&link.OriginalURL,
		&link.CreatedBy,
		&link.CreatedAt,
	)

	if err == pgx.ErrNoRows {
		return nil, nil
	}

	if err != nil {
		return nil, err
	}

	return &link, nil
}

func (r *PostgresLinkRepository) FindByAlias(
	ctx context.Context,
	alias string,
) (*models.Link, error) {

	query := `
	SELECT
		id,
		code,
		alias,
		original_url,
		created_by,
		created_at
	FROM links
	WHERE alias=$1
	`

	var link models.Link

	err := r.db.QueryRow(
		ctx,
		query,
		alias,
	).Scan(
		&link.ID,
		&link.Code,
		&link.Alias,
		&link.OriginalURL,
		&link.CreatedBy,
		&link.CreatedAt,
	)

	if err == pgx.ErrNoRows {
		return nil, nil
	}

	if err != nil {
		return nil, err
	}

	return &link, nil
}

func (r *PostgresLinkRepository) List(
	ctx context.Context,
	limit int,
	offset int,
) ([]models.Link, error) {

	query := `
	SELECT
		id,
		code,
		alias,
		original_url,
		created_by,
		created_at
	FROM links
	ORDER BY created_at DESC
	LIMIT $1 OFFSET $2
	`

	rows, err := r.db.Query(
		ctx,
		query,
		limit,
		offset,
	)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var links []models.Link

	for rows.Next() {

		var link models.Link

		err := rows.Scan(
			&link.ID,
			&link.Code,
			&link.Alias,
			&link.OriginalURL,
			&link.CreatedBy,
			&link.CreatedAt,
		)

		if err != nil {
			return nil, err
		}

		links = append(
			links,
			link,
		)
	}

	return links, rows.Err()
}

func (r *PostgresLinkRepository) IncrementClick(
	ctx context.Context,
	linkID string,
) error {

	query := `
	INSERT INTO clicks
	(
		link_id
	)
	VALUES
	($1)
	`

	_, err := r.db.Exec(
		ctx,
		query,
		linkID,
	)

	return err
}

func (r *PostgresLinkRepository) GetTotalClicks(
	ctx context.Context,
	linkID string,
) (int, error) {

	query := `
	SELECT COUNT(*)
	FROM clicks
	WHERE link_id=$1
	`

	var total int

	err := r.db.QueryRow(
		ctx,
		query,
		linkID,
	).Scan(
		&total,
	)

	return total, err
}

func (r *PostgresLinkRepository) GetDailyStats(
	ctx context.Context,
	linkID string,
) ([]dto.DailyStats, error) {

	query := `
	SELECT
		DATE(clicked_at),
		COUNT(*)
	FROM clicks
	WHERE link_id=$1
	GROUP BY DATE(clicked_at)
	ORDER BY DATE(clicked_at)
	`

	rows, err := r.db.Query(ctx, query, linkID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var stats []dto.DailyStats

	for rows.Next() {

		var day time.Time
		var count int

		if err := rows.Scan(&day, &count); err != nil {
			return nil, err
		}

		stats = append(stats, dto.DailyStats{
			Date:  day.Format("2006-01-02"),
			Count: count,
		})
	}

	return stats, rows.Err()
}
