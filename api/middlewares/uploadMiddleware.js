const multer = require('multer');
const path = require('path');
const os = require('os');

// Em ambiente serverless como Vercel, sempre use memoryStorage
// Isso evita problemas de permissão com o sistema de arquivos
const storage = process.env.VERCEL 
    ? multer.memoryStorage()
    : multer.diskStorage({
        destination: function (req, file, cb) {
            // Em ambiente local, usar a pasta 'uploads'
            const uploadDir = path.join(process.cwd(), 'uploads');
            // Não tentamos criar o diretório aqui - isso é feito no server.js
            cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        }
    });

// Filtro para aceitar apenas arquivos PDF
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Apenas arquivos PDF são permitidos!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Limitar tamanho para 5MB
    }
});

module.exports = upload;