package utils

import "testing"

func TestGenerateCode(t *testing.T) {

	code, err := GenerateCode(6)

	if err != nil {

		t.Fatal(err)

	}

	if len(code) != 6 {

		t.Fatalf(
			"expected 6 got %d",
			len(code),
		)

	}

}

func TestGenerateUniqueCodes(t *testing.T) {

	seen := map[string]bool{}

	for i := 0; i < 1000; i++ {

		code, _ := GenerateCode(6)

		if seen[code] {

			t.Fatalf(
				"duplicate code %s",
				code,
			)

		}

		seen[code] = true

	}

}