package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/Svaratharajan-svs/linkr/backend/dto"
	"github.com/Svaratharajan-svs/linkr/backend/service"
	"github.com/Svaratharajan-svs/linkr/backend/worker"
)

type LinkHandler struct {
	service *service.LinkService
}

func NewLinkHandler(
	service *service.LinkService,
) *LinkHandler {

	return &LinkHandler{
		service: service,
	}
}

func (h *LinkHandler) CreateLink(
	c *gin.Context,
) {

	var req dto.CreateLinkRequest

	if err := c.ShouldBindJSON(&req); err != nil {

		c.JSON(
			http.StatusBadRequest,
			gin.H{
				"error": "invalid request",
			},
		)

		return
	}

	// Later this comes from Cognito JWT claims

	userID := "admin"

	response, err :=
		h.service.CreateLink(
			c.Request.Context(),
			req,
			userID,
		)

	if err != nil {

		c.JSON(
			http.StatusBadRequest,
			dto.ErrorResponse{
				Error: err.Error(),
			},
		)

		return
	}

	c.JSON(
		http.StatusCreated,
		response,
	)

}

func (h *LinkHandler) ListLinks(
	c *gin.Context,
) {

	page, _ :=
		strconv.Atoi(
			c.DefaultQuery(
				"page",
				"1",
			),
		)

	limit, _ :=
		strconv.Atoi(
			c.DefaultQuery(
				"limit",
				"10",
			),
		)

	links, err :=
		h.service.ListLinks(
			c.Request.Context(),
			page,
			limit,
		)

	if err != nil {

		c.JSON(
			http.StatusInternalServerError,
			dto.ErrorResponse{
				Error: err.Error(),
			},
		)

		return
	}

	response := dto.PaginationResponse{

		Page: page,

		Limit: limit,

		Items: links,
	}

	c.JSON(
		http.StatusOK,
		response,
	)

}

func (h *LinkHandler) Redirect(
	c *gin.Context,
) {

	code :=
		c.Param("code")

	link, err :=
		h.service.FindByCode(
			c.Request.Context(),
			code,
		)

	if err != nil || link == nil {

		c.JSON(
			404,
			gin.H{
				"error": "link not found",
			},
		)

		return
	}

	// Async click recording

	go func() {

		worker.ClickChannel <- worker.ClickEvent{

			LinkID: link.ID,
		}

	}()

	c.Redirect(
		302,
		link.OriginalURL,
	)

}

func (h *LinkHandler) Stats(
	c *gin.Context,
) {

	code :=
		c.Param("code")

	link, err :=
		h.service.FindByCode(
			c.Request.Context(),
			code,
		)

	if err != nil || link == nil {

		c.JSON(
			http.StatusNotFound,
			gin.H{
				"error": "link not found",
			},
		)

		return
	}

	response, err :=
		h.service.GetStats(
			c.Request.Context(),
			link.ID,
		)

	if err != nil {

		c.JSON(
			500,
			dto.ErrorResponse{
				Error: err.Error(),
			},
		)

		return
	}

	c.JSON(
		200,
		response,
	)

}
