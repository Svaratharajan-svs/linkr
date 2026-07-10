package integration


import (
	"testing"
	"net/http"
	"net/http/httptest"

	"github.com/gin-gonic/gin"

	"github.com/Svaratharajan-svs/linkr/backend/tests"
)



func TestCreateLinkAPI(
	t *testing.T,
){


	tests.SetupDatabase()

	defer tests.Cleanup()



	gin.SetMode(
		gin.TestMode,
	)



	router :=
	gin.New()



	router.POST(
		"/api/links",
		func(c *gin.Context){


			c.JSON(
				http.StatusCreated,
				gin.H{
					"code":"abc123",
				},
			)

		},
	)



	req :=
	httptest.NewRequest(
		"POST",
		"/api/links",
		nil,
	)


	rec :=
	httptest.NewRecorder()



	router.ServeHTTP(
		rec,
		req,
	)



	if rec.Code != http.StatusCreated {


		t.Fatalf(
			"expected 201 got %d",
			rec.Code,
		)

	}

}