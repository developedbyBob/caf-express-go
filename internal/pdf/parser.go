package pdf

import (
	"errors"
	"fmt"
	"os"
	"regexp"
	"strconv"
	"strings"

	"github.com/ledongthuc/pdf"
)

// ExtractWeights extrai os pesos do PDF
func ExtractWeights(filepath string) ([]float64, error) {
	f, r, err := pdf.Open(filepath)
	if err != nil {
		return nil, fmt.Errorf("falha ao abrir o PDF: %w", err)
	}
	defer f.Close()

	var weights []float64
	// Regex para encontrar pesos no formato tx0,3 ou tx0.3
	re := regexp.MustCompile(`tx([\d.,]+)`)

	// Processar todas as páginas do PDF
	totalPage := r.NumPage()
	for pageIndex := 1; pageIndex <= totalPage; pageIndex++ {
		p := r.Page(pageIndex)
		if p.V.IsNull() {
			continue
		}
		
		text, err := p.GetPlainText(nil)
		if err != nil {
			continue
		}

		// Procurar por padrões de peso em cada linha
		for _, line := range strings.Split(text, "\n") {
			matches := re.FindAllStringSubmatch(line, -1)
			for _, match := range matches {
				if len(match) > 1 {
					// Substituir vírgula por ponto para converter para float
					weightStr := strings.Replace(match[1], ",", ".", 1)
					weight, err := strconv.ParseFloat(weightStr, 64)
					if err == nil {
						weights = append(weights, weight)
					}
				}
			}
		}
	}

	if len(weights) == 0 {
		return nil, errors.New("nenhum peso encontrado no PDF")
	}

	return weights, nil
}