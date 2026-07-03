package services

import (
	"context"
	"backend-portofolio/internal/core/ports"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type authService struct {
	secret     string
	adminEmail string
	adminPass  string
}

func NewAuthService(secret, email, pass string) ports.AuthService {
	return &authService{
		secret:     secret,
		adminEmail: email,
		adminPass:  pass,
	}
}

func (s *authService) Login(ctx context.Context, email, password string) (string, error) {
	if email != s.adminEmail || password != s.adminPass {
		return "", errors.New("invalid credentials")
	}

	claims := jwt.MapClaims{
		"sub": email,
		"exp": time.Now().Add(24 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tstr, err := token.SignedString([]byte(s.secret))
	if err != nil {
		return "", err
	}

	return tstr, nil
}
