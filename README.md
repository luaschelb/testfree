# TestFree

Um projeto para criar uma solução open-source para gerenciamento de testes manuais.

## Visão Geral

Este repositório contém duas partes principais da aplicação: 

- **API**: Gerencia a lógica de back-end, incluindo as operações de banco de dados e APIs.
- **App**: Front-end que permite a interação com a aplicação.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- Node.js (versão 14 ou superior recomendada)
- npm (incluído com o Node.js)

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/luaschelb/testfree.git
   cd testfree
   ```

2. Instale as dependências para cada parte do projeto:

   **API:**
   ```bash
   cd api
   npm install
   ```

   **App:**
   Abra outro terminal e execute:
   ```bash
   cd app
   npm install
   ```

## Executando o Projeto

1. No terminal da **API**, execute:
   ```bash
   npm start
   ```
   Isso iniciará o servidor de back-end.

2. No terminal da **App**, execute:
   ```bash
   npm start
   ```
   Isso iniciará o servidor de front-end.

## Acessando a Aplicação

Após iniciar ambos os servidores:

- O front-end estará disponível em: http://localhost:3000
- O back-end estará disponível em: http://localhost:8080 (ou conforme configurado).

## Contribuição

Sinta-se à vontade para abrir issues ou enviar pull requests para melhorias ou novas funcionalidades. 

---

TestFree é um projeto open-source, e sua colaboração é muito bem-vinda!
