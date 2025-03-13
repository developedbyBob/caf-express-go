package api

import (
	"encoding/json"
	"io"
	"net/http"
	"os"
	"path/filepath"

	"github.com/scg/caf-express-go/internal/pdf"
	"github.com/seu-usuario/caf-express-go/internal/service"
	"github.com/seu-usuario/caf-express-go/configs"
)

// HandleUploadPDF processa o upload de arquivos PDF e calcula os custos
func HandleUploadPDF(w http.ResponseWriter, r *http.Request) {
	// Verificar se o método é POST
	if r.Method != http.MethodPost {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	// Limite de memória de 10MB para o upload
	r.ParseMultipartForm(10 << 20)
	
	// Recuperar o arquivo do formulário
	file, handler, err := r.FormFile("pdfFile")
	if err != nil {
		http.Error(w, "Erro ao receber o arquivo: "+err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Verificar se é um arquivo PDF
	if filepath.Ext(handler.Filename) != ".pdf" {
		http.Error(w, "Apenas arquivos PDF são aceitos", http.StatusBadRequest)
		return
	}

	// Criar um arquivo temporário
	config := configs.GetConfig()
	tempFile, err := os.CreateTemp(config.UploadDir, "upload-*.pdf")
	if err != nil {
		http.Error(w, "Erro ao criar arquivo temporário: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer os.Remove(tempFile.Name()) // Limpar o arquivo após processar
	defer tempFile.Close()

	// Copiar o conteúdo do arquivo para o arquivo temporário
	_, err = io.Copy(tempFile, file)
	if err != nil {
		http.Error(w, "Erro ao salvar o arquivo: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Extrair dados do PDF
	weights, err := pdf.ExtractWeights(tempFile.Name())
	if err != nil {
		http.Error(w, "Erro ao processar o PDF: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Calcular custos
	total := service.CalculateDeliveryCosts(weights)

	// Preparar resposta JSON
	response := map[string]interface{}{
		"total":   total,
		"weights": weights,
	}

	// Enviar resposta
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}