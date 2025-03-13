const fs = require('fs');
const pdfService = require('../services/pdfService');

/**
 * Controller para processar o upload e análise de PDFs
 */
const pdfController = {
    /**
     * Processa o upload de PDF e retorna os resultados calculados
     */
    async uploadAndProcess(req, res) {
        // Verificar se um arquivo foi enviado
        if (!req.file) {
            return res.status(400).json({ 
                success: false,
                error: 'Nenhum arquivo foi enviado' 
            });
        }

        try {
            // Verificar se o arquivo existe
            if (!fs.existsSync(req.file.path)) {
                return res.status(500).json({
                    success: false,
                    error: `Arquivo não encontrado no caminho: ${req.file.path}`
                });
            }
            
            // Ler o arquivo PDF
            const dataBuffer = fs.readFileSync(req.file.path);
            
            // Processar o PDF e calcular os custos
            const result = await pdfService.processPdf(dataBuffer);
            
            // Retornar os resultados calculados
            res.json({ 
                success: true,
                ...result
            });
        } catch (error) {
            console.error('Erro ao processar o arquivo', error);
            res.status(500).json({ 
                success: false,
                error: 'Erro ao processar o arquivo' 
            });
        } finally {
            // Remover o arquivo temporário
            fs.unlink(req.file.path, (err) => {
                if (err) console.error(`Erro ao deletar o arquivo: ${err}`);
            });
        }
    }
};

module.exports = pdfController;