package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/Svaratharajan-svs/linkr/backend/auth"
	"github.com/Svaratharajan-svs/linkr/backend/config"
	"github.com/Svaratharajan-svs/linkr/backend/db"
	"github.com/Svaratharajan-svs/linkr/backend/handlers"
	"github.com/Svaratharajan-svs/linkr/backend/middleware"
	"github.com/Svaratharajan-svs/linkr/backend/routes"
	"github.com/Svaratharajan-svs/linkr/backend/repository"
	"github.com/Svaratharajan-svs/linkr/backend/service"
	"github.com/Svaratharajan-svs/linkr/backend/worker"
)

func main() {

	// Load environment variables
	cfg := config.Load()


	// Connect PostgreSQL
	dbPool := db.New(cfg.DatabaseURL)

	defer dbPool.Close()

linkRepository :=
	repository.NewPostgresLinkRepository(
		dbPool,
	)
worker.StartClickWorker(
	linkRepository,
)

linkService :=
	service.NewLinkService(
		linkRepository,
		cfg,
	)

	// Load Cognito JWKS
	jwks, err := auth.LoadJWKS(
		cfg.CognitoRegion,
		cfg.CognitoPool,
	)

	if err != nil {
		log.Fatal(
			"Failed to load Cognito JWKS:",
			err,
		)
	}


	// Create Gin router
	router := gin.Default()

	// Health handler
	healthHandler :=
		handlers.NewHealthHandler(dbPool)

	// Link handler
		linkHandler :=
	handlers.NewLinkHandler(
		linkService,
	)

	/*
	    Public Routes

	    No JWT required

	    Example:
	    GET /abc123
	*/

	router.GET(
		"/health",
		healthHandler.Health,
	)

	router.GET(
	"/:code",
	linkHandler.Redirect,
)
router.HEAD("/:code", linkHandler.Redirect)


	/*
	    Protected API Routes

	    JWT required
	*/
	api := router.Group("/api")


	api.Use(
		middleware.AuthMiddleware(jwks),
	)


	routes.RegisterProtected(
		api,
		linkHandler,
	)



	// HTTP Server
	server := &http.Server{

		Addr: ":" + cfg.Port,

		Handler: router,
	}



	// Start server
	go func(){

		log.Printf(
			"Server running on port %s",
			cfg.Port,
		)


		if err := server.ListenAndServe(); err != nil &&
			err != http.ErrServerClosed {

			log.Fatal(err)

		}

	}()



	// Graceful shutdown

	stop := make(
		chan os.Signal,
		1,
	)


	signal.Notify(
		stop,
		os.Interrupt,
		syscall.SIGTERM,
	)



	<-stop



	log.Println(
		"Shutting down server...",
	)



	ctx, cancel :=
		context.WithTimeout(
			context.Background(),
			5*time.Second,
		)


	defer cancel()



	if err := server.Shutdown(ctx); err != nil {

		log.Fatal(
			"Server forced shutdown:",
			err,
		)

	}


	log.Println(
		"Server stopped",
	)

}