package utils

import "testing"

func TestIsValidURL(t *testing.T) {

	tests := []struct {
		url      string
		expected bool
	}{
		{"https://google.com", true},
		{"http://example.com", true},
		{"ftp://server.com", true},
		{"google.com", false},
		{"abc", false},
		{"", false},
	}

	for _, test := range tests {

		result := IsValidURL(test.url)

		if result != test.expected {
			t.Errorf(
				"%s expected %v got %v",
				test.url,
				test.expected,
				result,
			)
		}
	}
}
