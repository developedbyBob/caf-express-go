// api/index.js
// Este arquivo serve como ponto de entrada para funções serverless no Vercel

const app = require('./server');

// Exportar o aplicativo Express diretamente para uso com serverless
module.exports = app;