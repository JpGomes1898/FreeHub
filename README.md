<h1 align="center">
  🚀 FreeHub
</h1>

<p align="center">
  Uma plataforma SaaS para conectar prestadores de serviços e clientes com um sistema inteligente de negociação.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white" />
</p>

<br>

💡 O Diferencial

O **FreeHub** não é apenas um mural de anúncios. O foco do projeto é o fluxo de **negociação real** entre as partes:

1.  Proposta & Contraproposta:** O prestador não precisa aceitar o preço fixo; ele pode sugerir um novo valor.
2.  Aprovação do Cliente:** O cliente recebe a contraproposta e decide se Aprova ou Recusa.
3.  Gestão Financeira:** O prestador possui um dashboard exclusivo que soma os ganhos de serviços concluídos (Gamificação).
4.  Geolocalização:** Cadastro inteligente de endereços integrado à API ViaCEP.

🛠️ Instalação e Execução

Este projeto utiliza uma arquitetura **Monorepo** (Frontend e Backend juntos). Siga os passos abaixo para rodar:

Pré-requisitos
* Node.js (v16+)
* Git

1️⃣ Configurando o Backend (API)

Entre na pasta do projeto
cd saas-freelance-backend  # (Ou o nome da sua pasta raiz)

Instale as dependências
npm install

Configure o Banco de Dados (SQLite)
npx prisma migrate dev --name init

Rode o servidor
node server.js

2️⃣ Configurando o Frontend (Interface)
Abra um novo terminal e rode:

Instale as dependências
npm install

Inicie o projeto React
npm run dev
Acesse o site em: http://localhost:5173

🗂 Estrutura do Projeto
/src: Contém todo o código React (Páginas, Componentes, Modais).

/prisma: Contém o esquema do banco de dados (schema.prisma) e o arquivo do banco local (dev.db).

server.js: Arquivo principal da API (Express).
