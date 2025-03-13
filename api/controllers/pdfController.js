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
            console.log(`Arquivo recebido: ${req.file.originalname}`);
            
            let dataBuffer;
            
            // Verificar se estamos no Vercel (usando memoryStorage)
            if (process.env.VERCEL) {
                console.log('Ambiente Vercel detectado, usando buffer da memória');
                // No Vercel, o arquivo estará disponível como buffer em req.file.buffer
                dataBuffer = req.file.buffer;
            } else {
                // Em ambiente local, o arquivo está salvo no disco
                console.log(`Arquivo salvo em ${req.file.path}`);
                // Verificar se o arquivo existe no disco
                if (!fs.existsSync(req.file.path)) {
                    throw new Error(`Arquivo não encontrado no caminho: ${req.file.path}`);
                }
                
                // Ler o arquivo do disco
                dataBuffer = fs.readFileSync(req.file.path);
            }
            
            if (!dataBuffer || dataBuffer.length === 0) {
                throw new Error('Buffer de arquivo vazio');
            }
            
            console.log(`Buffer de arquivo obtido, tamanho: ${dataBuffer.length} bytes`);
            
            // Processar o PDF e calcular os custos
            const result = await pdfService.processPdf(dataBuffer);
            
            // Retornar os resultados calculados
            res.json({ 
                success: true,
                ...result
            });
        } catch (error) {
            console.error('Erro ao processar o arquivo:', error);
            res.status(500).json({ 
                success: false,
                error: `Erro ao processar o arquivo: ${error.message}`,
                stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
            });
        } finally {
            // Remover o arquivo temporário apenas se estiver em ambiente local
            // e se o arquivo existir no sistema de arquivos
            if (!process.env.VERCEL && req.file && req.file.path) {
                try {
                    if (fs.existsSync(req.file.path)) {
                        fs.unlinkSync(req.file.path);
                        console.log(`Arquivo temporário removido: ${req.file.path}`);
                    }
                } catch (err) {
                    console.error(`Erro ao deletar o arquivo temporário: ${err.message}`);
                }
            }
        }
    }
};

module.exports = pdfController;