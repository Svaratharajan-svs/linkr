package utils

import "testing"

func TestIsValidAlias(t *testing.T) {

	tests := []struct {
		alias string
		valid bool
	}{
		{"google", true},
		{"google123", true},
		{"abc-123", true},
		{"abc_def", true},

		{"", false},
		{"ab", false},
		{"@", false},
		{"hello world", false},
		{"abc$", false},
	}

	for _, tt := range tests {

		got := IsValidAlias(tt.alias)

		if got != tt.valid {

			t.Fatalf(
				"%s expected %v got %v",
				tt.alias,
				tt.valid,
				got,
			)

		}

	}

}