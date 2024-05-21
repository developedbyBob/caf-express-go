const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Serve arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota para verificar o status do servidor
app.get('/status', (req, res) => {
    res.status(200).send('Server is running');
});

app.post('/upload', upload.single('pdfFile'), async (req, res) => {
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
