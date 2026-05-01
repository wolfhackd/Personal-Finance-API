# Personal Finance API

API REST para controle de finanças pessoais com autenticação JWT, cadastro de usuários,
lançamento de receitas/despesas, cálculo de saldo e relatórios.

## Tecnologias

- Node.js
- TypeScript
- Fastify
- Prisma ORM
- PostgreSQL
- JWT (Bearer Token)
- Zod
- Docker

## Regras de negócio

- Cada usuário acessa apenas suas próprias transações
- Senhas são armazenadas com hash (bcrypt)
- `amount` deve ser maior que zero
- Tipo da transação deve ser `INCOME` ou `EXPENSE`

## Pré-requisitos

- Node.js 20+ (recomendado LTS)
- npm 10+
- Docker Desktop (para subir o PostgreSQL)

## Executando localmente (ponta a ponta)

### 1) Clone o repositório

```bash
git clone https://github.com/wolfhackd/Personal-Finance-API.git
cd Personal-Finance-API
```

### 2) Instale as dependências

```bash
npm install
```

### 3) Configure variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto usando o `.env.example` como base.

Windows (PowerShell):
```powershell
Copy-Item .env.example .env
```

Linux/macOS:
```bash
cp .env.example .env
```

Exemplo de `.env` válido:

```env
DATABASE_URL="postgresql://admin:admin@localhost:5432/finance?schema=public"
JWT_SECRET="troque-por-um-segredo-forte"
PORT=3333
FORECAST_SERVICE_URL="http://localhost:4000"
```

> `FORECAST_SERVICE_URL` é necessária para `GET /report/forecast`.

### 4) Suba o PostgreSQL com Docker

```bash
docker compose up -d
```

Para parar:

```bash
docker compose down
```

### 5) Rode as migrations do Prisma

```bash
npx prisma migrate deploy
```

Em ambiente de desenvolvimento, se precisar criar/ajustar migrations:

```bash
npx prisma migrate dev
```

### 6) Gere o client do Prisma

```bash
npx prisma generate
```

### 7) (Opcional) Popule com seed

```bash
npm run seed
```

### 8) Inicie a API

```bash
npm run dev
```

API disponível em:

`http://localhost:3333`

## Fluxo rápido de autenticação

### Criar usuário

```bash
curl -X POST http://localhost:3333/users \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Mauro\",\"email\":\"mauro@email.com\",\"password\":\"123456\"}"
```

### Login (retorna token)

```bash
curl -X POST http://localhost:3333/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"mauro@email.com\",\"password\":\"123456\"}"
```

### Rota autenticada (exemplo)

```bash
curl http://localhost:3333/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## Endpoints

### Públicas

- `POST /users` - cria usuário
- `POST /login` - autentica usuário

### Autenticadas (Bearer token)

- `GET /me` - retorna id do usuário autenticado
- `POST /transactions` - cria transação
- `GET /transactions` - lista transações (aceita `date` e `endDate` como query)
- `GET /transactions/:id` - busca transação por id
- `GET /transactions/balance` - saldo do usuário
- `GET /transactions/report?date=YYYY-MM-DD` - relatório por mês/ano da data enviada
- `GET /report` - relatório mensal agrupado por categoria
- `GET /report/forecast` - consulta previsão no microserviço externo

## Scripts úteis

- `npm run dev` - sobe API em modo desenvolvimento (`tsx watch`)
- `npm run build` - compila TypeScript
- `npm run start` - executa build em produção
- `npm run seed` - executa seed

## Autor

Mauro Leal  
Backend Developer  
Pernambuco - Brasil  
[LinkedIn](https://www.linkedin.com/)  
[GitHub](https://github.com/wolfhackd)
