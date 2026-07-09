package utils

import "testing"

func TestAliasValidation(t *testing.T) {

	valid := []string{
		"hello",
		"my-link",
		"user_1",
	}

	for _, alias := range valid {

		if !IsValidAlias(alias) {
			t.Errorf("%s should be valid", alias)
		}
	}

	invalid := []string{
		"",
		"a",
		"hello world",
		"###",
	}

	for _, alias := range invalid {

		if IsValidAlias(alias) {
			t.Errorf("%s should be invalid", alias)
		}
	}
}
