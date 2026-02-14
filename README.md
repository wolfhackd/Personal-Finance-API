# 💰 Personal Finance API

API REST para controle de finanças pessoais, permitindo cadastro de usuários,
registro de receitas e despesas e cálculo automático de saldo.

## 🚀 Tecnologias

- Node.js
- TypeScript
- Fastify
- Prisma ORM
- PostgreSQL
- JWT(Bearer Authentication)
- Zod
- Docker

## 🧠 Regras de Negócio

- Usuário só acessa suas próprias transações
- Valores devem ser maiores que zero
- Transações podem ser income ou expense
- Senhas são armazenadas criptografadas

## ⚙️ Como executar

1. Clone o repositório

```bash
git clone https://github.com/seuusuario/personal-finance-api

npm install

npm run dev
```

## 🐳 Docker(Conteinerização)

1. Subindo compose

- Obs. Tenha o docker rodando em segundo plano

```bash
docker-compose up --build -d
```

## 📊 Endpoints

- POST /users
- POST /login
- GET /transactions
- POST /transactions
- GET /balance

## 👨‍💻 Autor

Mauro Leal
Backend Developer
📍 Pernambuco
🔗 LinkedIn
🔗 GitHub


