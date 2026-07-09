package utils

import "errors"

var (
	ErrInvalidURL      = errors.New("invalid url")
	ErrAliasExists     = errors.New("alias already exists")
	ErrInvalidAlias    = errors.New("invalid alias")
	ErrCodeGeneration  = errors.New("unable to generate short code")
	ErrDuplicateCode   = errors.New("duplicate generated code")
)