package auth

import (
	"context"
	"fmt"

	keyfunc "github.com/MicahParks/keyfunc/v3"
)


func LoadJWKS(
	region string,
	pool string,
) (keyfunc.Keyfunc, error) {


	jwksURL := fmt.Sprintf(
		"https://cognito-idp.%s.amazonaws.com/%s/.well-known/jwks.json",
		region,
		pool,
	)


	ctx := context.Background()


	return keyfunc.NewDefaultCtx(
		ctx,
		[]string{
			jwksURL,
		},
	)

}