package worker

import (
	"context"
	"log"

	"github.com/Svaratharajan-svs/linkr/backend/repository"
)

type ClickEvent struct {
	LinkID string
}

var ClickChannel = make(
	chan ClickEvent,
	1000,
)

func StartClickWorker(
	repo repository.LinkRepository,
) {

	go func() {

		for event := range ClickChannel {

			err :=
				repo.IncrementClick(
					context.Background(),
					event.LinkID,
				)

			if err != nil {

				log.Println(
					"click insert failed:",
					err,
				)

			}

		}

	}()

}
