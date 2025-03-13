// api/middlewares/uploadMiddleware.js
const multer = require('multer');
const path = require('path');
const os = require('os');

// Determinar o diretório de upload com base no ambiente
const uploadDir = process.env.VERCEL ? os.tmpdir() : path.join(process.cwd(), 'uploads');

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Criar nome de arquivo único com timestamp
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