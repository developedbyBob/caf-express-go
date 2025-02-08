PDF Upload and Process (CAF EXPRESS)
======================

Este é um projeto simples que permite fazer o upload de arquivos PDF para calcular os custos de entrega com base nos pesos dos itens no PDF.

Funcionalidades
---------------

-   Faça o upload de um arquivo PDF contendo informações de entrega.
-   Calcule os custos de entrega com base nos pesos dos itens no PDF.
-   Exiba o total dos custos de entrega.

Como Usar
---------

1.  Clone este repositório para o seu ambiente local.

2.  Certifique-se de ter o Node.js instalado em sua máquina.

3.  Instale as dependências do projeto executando o seguinte comando no terminal:

    Copiar código

    `npm install`

4.  Inicie o servidor local executando o seguinte comando:

    Copiar código

    `node server.js`

5.  Abra o navegador e acesse `http://localhost:3000` para visualizar a página de upload de PDF.

6.  Selecione um arquivo PDF contendo as informações de entrega e clique no botão "Upload and Calculate".

7.  Aguarde até que os custos de entrega sejam calculados e exibidos na página.

Estrutura do Projeto
--------------------

-   `server.js`: Arquivo que contém o código do servidor Node.js.
-   `public/`: Pasta contendo os arquivos estáticos do frontend (HTML, CSS, JavaScript).
-   `uploads/`: Pasta onde os arquivos PDF enviados pelos usuários são armazenados temporariamente.
-   `.gitignore`: Arquivo que especifica quais arquivos e pastas devem ser ignorados pelo Git.
-   `package.json` e `package-lock.json`: Arquivos de manifesto do Node.js que especificam as dependências do projeto.

Tecnologias Utilizadas
----------------------

-   Node.js
-   Express.js
-   Multer (para upload de arquivos)
-   pdf-parse (para análise de arquivos PDF)

Contribuindo
------------

Se você quiser contribuir com este projeto, sinta-se à vontade para abrir uma issue ou enviar um pull request.
