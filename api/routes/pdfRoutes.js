const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const upload = require('../middlewares/uploadMiddleware');

// Rota para upload e processamento de PDF
router.post('/upload', upload.single('pdfFile'), pdfController.uploadAndProcess);

// Rota de verificação de status da API
router.get('/status', (req, res) => {
    res.json({ status: 'online' });
});

module.exports = router;