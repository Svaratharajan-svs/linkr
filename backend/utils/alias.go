package utils

import "regexp"

var aliasRegex = regexp.MustCompile(`^[a-zA-Z0-9_-]{3,30}$`)

func IsValidAlias(alias string) bool {
	return aliasRegex.MatchString(alias)
}
