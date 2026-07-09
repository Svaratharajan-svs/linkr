package routes


import (

"github.com/gin-gonic/gin"

"github.com/Svaratharajan-svs/linkr/backend/handlers"

)



func RegisterProtected(

	api *gin.RouterGroup,

	linkHandler *handlers.LinkHandler,

){



	api.POST(
		"/links",
		linkHandler.CreateLink,
	)


	api.GET(
		"/links",
		linkHandler.ListLinks,
	)


	api.GET(
		"/links/:code/stats",
		linkHandler.Stats,
	)

}