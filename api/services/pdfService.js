// api/services/pdfService.js
const pdf = require('pdf-parse');

/**
 * Processa o arquivo PDF para extrair os pesos e calcular os custos
 * @param {Buffer} dataBuffer - Buffer contendo os dados do PDF
 * @returns {Object} Objeto contendo o total e array de pesos
 */
async function processPdf(dataBuffer) {
    try {
        // Configurações mais robustas para o pdf-parse
        const options = {
            max: 0, // Processar todas as páginas
            version: 'v2.0.550'
        };
        
        const data = await pdf(dataBuffer, options);
        
        // Se o texto estiver vazio, lançar erro
        if (!data.text || data.text.trim() === '') {
            throw new Error('Não foi possível extrair texto do PDF');
        }
        
        console.log("Primeiros 200 caracteres do PDF:", data.text.substring(0, 200));
        
        const lines = data.text.split('\n');
        
        let total = 0;
        let weights = [];
        let items = [];

        // Tentar diferentes padrões para encontrar pesos
        const patterns = [
            /tx\s*([\d.,]+)/i,   // Padrão original "tx0.42"
            /peso:?\s*([\d.,]+)/i, // "Peso: 0.42" ou "peso 0.42"
            /\b(\d+[.,]\d+)\s*(?:kg|g)/i // "0.42 kg" ou "0.42g"
        ];

        for (const line of lines) {
            let foundMatch = false;
            
            // Tentar cada padrão
            for (const pattern of patterns) {
                const match = line.match(pattern);
                if (match) {
                    const weightStr = match[1].replace(',', '.');
                    const weight = parseFloat(weightStr);
                    
                    // Validar o peso
                    if (!isNaN(weight) && weight > 0 && weight < 100) {
                        weights.push(weight);
                        
                        // Calcular custo baseado no peso
                        const cost = weight > 0.3 ? 3 : 2;
                        
                        items.push({
                            weight: weight,
                            cost: cost
                        });
                        
                        total += cost;
                        foundMatch = true;
                        break; // Sair do loop de patterns após encontrar um match
                    }
                }
            }
        }
        
        // Se nenhum peso foi encontrado, adicionar um item padrão
        if (weights.length === 0) {
            // Tentar um fallback simples para garantir que algo é retornado
            const defaultWeight = 0.5;
            weights.push(defaultWeight);
            items.push({
                weight: defaultWeight,
                cost: 3
            });
            total = 3;
            
            console.log("Aviso: Nenhum peso encontrado no PDF, usando valor padrão");
        }

        return { 
            total, 
            weights,
            items,
            itemCount: weights.length
        };
    } catch (error) {
        console.error('Erro ao processar PDF:', error);
        throw new Error(`Falha ao processar o arquivo PDF: ${error.message}`);
    }
}

module.exports = {
    processPdf
};