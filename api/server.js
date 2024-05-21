const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: '/tmp' }); // Alterado para /tmp para funcionar no Vercel

app.use(express.static(path.join(__dirname, '../public')));

app.post('/api/upload', upload.single('pdfFile'), async (req, res) => {
    try {
        const dataBuffer = fs.readFileSync(req.file.path);
        const data = await pdf(dataBuffer);

        const lines = data.text.split('\n');
        let total = 0;
        let weights = [];

        for (const line of lines) {
            const match = line.match(/tx([\d.,]+)/);
            if (match) {
                const weight = parseFloat(match[1].replace(',', '.'));
                weights.push(weight);
                if (weight > 0.3) {
                    total += 3;
                } else {
                    total += 2;
                }
            }
        }

        res.json({ total, weights });
    } catch (error) {
        console.error('Erro ao processar o arquivo', error);
        res.status(500).json({ error: 'Erro ao processar o arquivo' });
    } finally {
        fs.unlink(req.file.path, (err) => {
            if (err) console.error(`Erro ao deletar o arquivo: ${err}`);
        });
    }
});

module.exports = app;
