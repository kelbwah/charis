package utils

import (
	"os"

	"golang.org/x/crypto/bcrypt"
)

var pepper = func() string {
	p := os.Getenv("PEPPER_SECRET")
	if p == "" {
		panic("PEPPER_SECRET must be set as enviroment variable.")
	}
	return p
}()

func HashPassword(password string) (string, error) {
	pwd := password + pepper
	bytes, err := bcrypt.GenerateFromPassword([]byte(pwd), 11)
	return string(bytes), err
}

func VerifyPassword(password, storedHash string) bool {
	pwd := password + pepper
	err := bcrypt.CompareHashAndPassword([]byte(storedHash), []byte(pwd))
	return err == nil
}
