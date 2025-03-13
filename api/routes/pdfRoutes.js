const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const upload = require('../middlewares/uploadMiddleware');
const debugHandler = require('../debug');

// Rota para upload e processamento de PDF
router.post('/upload', upload.single('pdfFile'), pdfController.uploadAndProcess);

// Rota de verificação de status da API
router.get('/status', (req, res) => {
    res.json({ 
        status: 'online',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        isVercel: !!process.env.VERCEL
    });
});

// Rota de debug para ambiente Vercel
router.get('/debug', debugHandler);

module.exports = router;