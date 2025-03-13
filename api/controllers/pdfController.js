// api/controllers/pdfController.js
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
            console.log(`Arquivo recebido: ${req.file.originalname}, salvo em ${req.file.path}`);
            
            // Verificar se o arquivo existe e tem tamanho
            const fileStats = fs.statSync(req.file.path);
            
            if (fileStats.size === 0) {
                throw new Error('Arquivo PDF vazio');
            }
            
            // Ler o arquivo PDF
            const dataBuffer = fs.readFileSync(req.file.path);
            
            if (!dataBuffer || dataBuffer.length === 0) {
                throw new Error('Não foi possível ler o conteúdo do arquivo');
            }
            
            console.log(`Arquivo lido com sucesso, tamanho: ${dataBuffer.length} bytes`);
            
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
                error: `Erro ao processar o arquivo: ${error.message}` 
            });
        } finally {
            // Tentar remover o arquivo temporário se ele existir
            try {
                if (req.file && req.file.path && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                    console.log(`Arquivo temporário removido: ${req.file.path}`);
                }
            } catch (err) {
                console.error(`Erro ao deletar o arquivo temporário: ${err.message}`);
            }
        }
    }
};

module.exports = pdfController;