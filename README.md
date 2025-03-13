# CAF Express - Calculadora de Entregas

## Sobre o Projeto

Esta aplicação web permite fazer o upload de arquivos PDF para calcular os custos de entrega com base nos pesos dos itens extraídos do PDF. A interface é totalmente responsiva e funciona tanto em desktops quanto em dispositivos móveis.

## Funcionalidades

- Interface responsiva para desktop e mobile
- Upload de arquivos PDF via drag & drop ou seleção de arquivo
- Extração de informações de peso dos documentos PDF
- Cálculo automático dos custos de entrega baseados no peso
- Exibição detalhada dos itens e seus respectivos custos
- Validação de arquivos (apenas PDFs são aceitos)

## Tecnologias Utilizadas

- **Backend:**
  - Node.js
  - Express.js
  - Multer (para upload de arquivos)
  - pdf-parse (para extração de conteúdo dos PDFs)

- **Frontend:**
  - HTML5
  - CSS3 (design responsivo)
  - JavaScript (ES6+)
  - Font Awesome (ícones)

## Demonstração

![Screenshot da aplicação](https://via.placeholder.com/800x400)

## Estrutura do Projeto

```
📁 projeto-pdf-caf
├── 📁 api
│   ├── 📁 controllers
│   │   └── pdfController.js
│   ├── 📁 middlewares
│   │   └── uploadMiddleware.js
│   ├── 📁 routes
│   │   └── pdfRoutes.js
│   ├── 📁 services
│   │   └── pdfService.js
│   └── server.js
├── 📁 public
│   ├── 📁 css
│   │   └── style.css
│   ├── 📁 js
│   │   └── script.js
│   ├── 📁 assets
│   │   └── img.jpg
│   └── index.html
├── .gitignore
├── package.json
├── README.md
└── vercel.json
```

## Como Usar

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/caf-express.git
   cd caf-express
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie a aplicação em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Acesse a aplicação em seu navegador:
   ```
   http://localhost:3000
   ```

## Deploy

A aplicação está configurada para deploy na plataforma Vercel, utilizando as configurações presentes no arquivo `vercel.json`.

### Como fazer o deploy:

1. Instale o CLI da Vercel:
   ```bash
   npm install -g vercel
   ```

2. Faça login na sua conta Vercel:
   ```bash
   vercel login
   ```

3. Deploy da aplicação:
   ```bash
   vercel
   ```

## Fluxo de Funcionamento

1. O usuário carrega um arquivo PDF através da interface da aplicação
2. O backend processa o arquivo utilizando pdf-parse para extrair o texto
3. O sistema identifica padrões de peso nos textos (formato "tx0.42" por exemplo)
4. Os custos são calculados com base nos pesos detectados:
   - Itens com peso maior que 0.3kg: R$3,00 por item
   - Itens com peso até 0.3kg: R$2,00 por item
5. Os resultados são exibidos de forma organizada na interface

## Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.