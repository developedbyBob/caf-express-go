package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/seu-usuario/caf-express-go/internal/api"
	"github.com/seu-usuario/caf-express-go/configs"
)

func main() {
	config := configs.GetConfig()
	
	// Configurar rotas estáticas
	fs := http.FileServer(http.Dir(filepath.Join("web", "static")))
	http.Handle("/static/", http.StripPrefix("/static/", fs))
	
	// Rota principal
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}
		http.ServeFile(w, r, filepath.Join("web", "templates", "index.html"))
	})
	
	// Configurar rotas da API
	http.HandleFunc("/api/upload", api.HandleUploadPDF)
	
	// Determinar a porta
	port := os.Getenv("PORT")
	if port == "" {
		port = config.ServerPort
	}
	
	// Iniciar servidor
	log.Printf("Servidor iniciado na porta %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}