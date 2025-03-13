package configs

import (
	"os"
)

// Config armazena as configurações da aplicação
type Config struct {
	ServerPort string
	UploadDir  string
}

// GetConfig retorna as configurações da aplicação
func GetConfig() *Config {
	// Definir diretório temporário para uploads
	uploadDir := os.TempDir()
	
	return &Config{
		ServerPort: "3000",
		UploadDir:  uploadDir,
	}
}