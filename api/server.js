// api/server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const os = require('os');
const pdfRoutes = require('./routes/pdfRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Determinar o diretório de uploads com base no ambiente
const uploadsDir = process.env.VERCEL ? os.tmpdir() : path.join(process.cwd(), 'uploads');

// Garantir que o diretório de uploads exista (somente em desenvolvimento)
if (!process.env.VERCEL && !fs.existsSync(uploadsDir)) {
    try {
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log(`Diretório de uploads criado: ${uploadsDir}`);
    } catch (err) {
        console.error(`Erro ao criar diretório de uploads: ${err.message}`);
    }
}

// Middleware para logs detalhados
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Middleware para lidar com erros CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Aumentar limite de payload para arquivos maiores
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configuração para servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Rotas da API
app.use('/api', pdfRoutes);

// Rota de fallback para SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Manipulação de erros
app.use((err, req, res, next) => {
    console.error('Erro não tratado:', err.stack);
    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'production' 
            ? 'Ocorreu um erro no servidor' 
            : err.message || 'Ocorreu um erro no servidor'
    });
});

// Iniciar o servidor se esse arquivo for executado diretamente
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
        console.log(`Ambiente: ${process.env.NODE_ENV || 'desenvolvimento'}`);
        console.log(`Diretório de uploads: ${uploadsDir}`);
        console.log(`Acesse: http://localhost:${PORT}`);
    });
}

module.exports = app;