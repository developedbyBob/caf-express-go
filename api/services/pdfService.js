const pdf = require('pdf-parse');
const fs = require('fs');

/**
 * Processa o arquivo PDF para extrair os pesos e calcular os custos
 * @param {Buffer} dataBuffer - Buffer contendo os dados do PDF
 * @returns {Object} Objeto contendo o total e array de pesos
 */
async function processPdf(dataBuffer) {
    try {
        const data = await pdf(dataBuffer);
        const lines = data.text.split('\n');
        
        let total = 0;
        let weights = [];
        let items = [];

        for (const line of lines) {
            // Melhorar a detecção dos pesos com regex mais preciso
            const match = line.match(/tx\s*([\d.,]+)/i);
            if (match) {
                const weight = parseFloat(match[1].replace(',', '.'));
                
                // Ignorar valores absurdos (possíveis falsos positivos)
                if (isNaN(weight) || weight > 100) continue;
                
                weights.push(weight);
                
                // Calcular custo baseado no peso
                const cost = weight > 0.3 ? 3 : 2;
                
                items.push({
                    weight: weight,
                    cost: cost
                });
                
                total += cost;
            }
        }

        return { 
            total, 
            weights,
            items,
            itemCount: weights.length
        };
    } catch (error) {
        console.error('Erro ao processar PDF:', error);
        throw new Error('Falha ao processar o arquivo PDF');
    }
}

module.exports = {
    processPdf
};