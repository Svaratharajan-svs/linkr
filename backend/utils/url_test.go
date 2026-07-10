package utils

import "testing"

func TestIsValidURL(t *testing.T) {

	tests := []struct {
		name     string
		url      string
		expected bool
	}{
		{
			name: "https",
			url: "https://google.com",
			expected: true,
		},
		{
			name: "http",
			url: "http://example.com",
			expected: true,
		},
		{
			name: "localhost",
			url: "http://localhost:8080",
			expected: true,
		},
		{
			name: "missing scheme",
			url: "google.com",
			expected: false,
		},
		{
			name: "invalid",
			url: "abc",
			expected: false,
		},
		{
			name: "empty",
			url: "",
			expected: false,
		},
	}

	for _, tt := range tests {

		t.Run(tt.name, func(t *testing.T) {

			got := IsValidURL(tt.url)

			if got != tt.expected {

				t.Fatalf(
					"expected %v got %v",
					tt.expected,
					got,
				)

			}

		})

	}

}