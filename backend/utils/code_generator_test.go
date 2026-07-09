package utils

import "testing"

func TestGenerateCode(t *testing.T) {

	code, err := GenerateCode(6)

	if err != nil {
		t.Fatal(err)
	}

	if len(code) != 6 {
		t.Fatal("invalid length")
	}
}
