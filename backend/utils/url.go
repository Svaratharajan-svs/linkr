package utils

import "net/url"

func IsValidURL(value string) bool {

	u, err := url.ParseRequestURI(value)

	if err != nil {
		return false
	}

	return u.Scheme != "" && u.Host != ""
}