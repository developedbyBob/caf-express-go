// api/debug.js
const os = require('os');
const path = require('path');
const fs = require('fs');

module.exports = (req, res) => {
  try {
    // Informações do ambiente
    const envInfo = {
      isVercel: !!process.env.VERCEL,
      nodeEnv: process.env.NODE_ENV,
      tempDir: os.tmpdir(),
      platform: os.platform(),
      cwd: process.cwd(),
      vercelRegion: process.env.VERCEL_REGION || 'N/A'
    };

    // Testar escrita em tmp
    const tempFilePath = path.join(os.tmpdir(), 'test-file-' + Date.now() + '.txt');
    fs.writeFileSync(tempFilePath, 'Test content');
    
    // Ler o arquivo para confirmar que escreveu corretamente
    const fileContent = fs.readFileSync(tempFilePath, 'utf8');
    
    // Limpar o arquivo
    fs.unlinkSync(tempFilePath);

    // Status dos diretórios
    const dirStatus = {
      tempDirExists: fs.existsSync(os.tmpdir()),
      tempDirWritable: true, // já testamos ao criar o arquivo
      tempFileCreated: true,
      tempFileContent: fileContent
    };

    // Informações sobre as dependências instaladas
    const dependencies = {
      express: require('express/package.json').version,
      multer: require('multer/package.json').version,
      pdfParse: require('pdf-parse/package.json').version
    };

    res.status(200).json({
      success: true,
      environment: envInfo,
      directories: dirStatus,
      dependencies: dependencies,
      headers: req.headers,
      message: 'Ambiente Vercel funcionando corretamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
      message: 'Falha ao testar o ambiente Vercel'
    });
  }
};