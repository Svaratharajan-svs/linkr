package handlers

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/Svaratharajan-svs/linkr/backend/config"
	"github.com/Svaratharajan-svs/linkr/backend/repository"
	"github.com/Svaratharajan-svs/linkr/backend/service"
	"github.com/Svaratharajan-svs/linkr/backend/worker"
)


func TestRedirectAsyncClick(t *testing.T) {


	gin.SetMode(
		gin.TestMode,
	)


	// clean channel before test

	for len(worker.ClickChannel) > 0 {

		<-worker.ClickChannel

	}



	// mock repository

	mockRepo :=
		&repository.MockRepository{
			CodeExists:true,
		}



	// create real service

	linkService :=
		service.NewLinkService(
			mockRepo,
			&config.Config{
				BaseURL:"http://localhost:8080",
			},
		)



	handler :=
		NewLinkHandler(
			linkService,
		)



	router :=
		gin.New()



	router.GET(
		"/:code",
		handler.Redirect,
	)



	req :=
		httptest.NewRequest(
			"GET",
			"/abc123",
			nil,
		)



	rec :=
		httptest.NewRecorder()



	start :=
		time.Now()



	router.ServeHTTP(
		rec,
		req,
	)



	duration :=
		time.Since(start)



	// redirect should be fast

	if duration >
		100*time.Millisecond {


		t.Fatalf(
			"redirect too slow: %v",
			duration,
		)

	}



	if rec.Code != http.StatusFound {


		t.Fatalf(
			"expected 302 got %d",
			rec.Code,
		)

	}



	// verify async event

	select {


	case event :=
		<-worker.ClickChannel:


		if event.LinkID == "" {

			t.Fatal(
				"missing link id",
			)

		}


	case <-time.After(
		time.Second,
	):

		t.Fatal(
			"click event not pushed",
		)

	}


}