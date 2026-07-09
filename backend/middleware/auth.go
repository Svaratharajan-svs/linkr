package middleware


import (

"net/http"

"strings"


"github.com/gin-gonic/gin"

"github.com/golang-jwt/jwt/v5"

keyfunc "github.com/MicahParks/keyfunc/v3"

)



func AuthMiddleware(
	jwks keyfunc.Keyfunc,
) gin.HandlerFunc {


	return func(c *gin.Context) {


		authHeader :=
			c.GetHeader("Authorization")


		if authHeader == "" {


			c.JSON(
				http.StatusUnauthorized,
				gin.H{
					"error":"missing token",
				},
			)


			c.Abort()

			return

		}



		tokenString :=
			strings.TrimPrefix(
				authHeader,
				"Bearer ",
			)



		token, err :=
			jwt.Parse(
				tokenString,
				jwks.Keyfunc,
			)



		if err != nil || !token.Valid {


			c.JSON(
				http.StatusUnauthorized,
				gin.H{
					"error":"invalid token",
				},
			)


			c.Abort()

			return
		}



		c.Set(
			"user",
			token.Claims,
		)


		c.Next()

	}

}