# Challenge Jitterbit — API de Pedidos

API REST para gerenciamento de pedidos, desenvolvida com Node.js, Express e PostgreSQL.

---

## 🛠️ Tecnologias

- **Node.js** — Runtime
- **Express** — Framework web
- **PostgreSQL** — Banco de dados
- **pg** — Driver PostgreSQL para Node
- **dotenv** — Variáveis de ambiente
- **swagger-ui-express** — Documentação
- **Docker** — Container do banco de dados

---

## 📁 Estrutura do projeto

```
CHALLENGE-JITTERBIT/
├── src/
│   ├── config/
│   │   ├── database.js       # Conexão com PostgreSQL
│   │   └── swagger.js        # Configuração do Swagger
│   ├── controllers/
│   │   └── orderController.js
│   ├── models/
│   │   └── Order.js
│   └── routes/
│       └── orderRoutes.js
├── .env                      # Variáveis de ambiente (não commitar)
├── .env.example              # Exemplo de variáveis de ambiente
├── docker-compose.yml        # Container do banco de dados
├── init.sql                  # Script de criação das tabelas
├── package.json
└── server.js
```

---

## ⚙️ Configuração

### 1. Clonar o repositório
```bash
git clone https://github.com/ju-ns/Challenge-Jitterbit.git
cd Challenge-Jitterbit
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
```bash
cp .env.example .env
```

Edite o `.env` com suas configurações:
```env
DB_HOST=
DB_LOCAL_PORT=
DB_PORT=
DB_NAME=challenge_jitterbit
DB_USER=seu_user
DB_PASSWORD=sua_senha
```

---

## 🐳 Rodando com Docker (recomendado)

Sobe o banco de dados em container — as tabelas são criadas automaticamente:

```bash
docker-compose up -d
```

Inicia o servidor:
```bash
node server.js
```

> O `init.sql` é executado automaticamente na primeira vez que o container sobe, criando as tabelas `order` e `items`.
> Obs: atualize o seu .env DB_PORT=5433 e DB_LOCAL_PORT=5432

---

## 💻 Rodando localmente (sem Docker)

Se preferir usar um PostgreSQL instalado na máquina, altere o `.env`:

```env
DB_PORT=5432
DB_LOCAL_PORT=5432
```

Crie o banco e as tabelas manualmente:
```sql
CREATE DATABASE challenge_jitterbit;
```

```sql
CREATE TABLE IF NOT EXISTS "order" (
  "orderId" VARCHAR(20) PRIMARY KEY,
  value NUMERIC(10, 2) NOT NULL,
  "creationDate" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  "orderId" VARCHAR(20) REFERENCES "order"("orderId"),
  "productId" VARCHAR(20) NOT NULL,
  quantity INTEGER NOT NULL,
  price NUMERIC(10, 2) NOT NULL
);
```

Inicia o servidor:
```bash
node server.js
```

---

## 🔗 Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/order` | Criar um novo pedido |
| GET | `/order/list` | Listar todos os pedidos |
| GET | `/order/:orderId` | Buscar pedido por ID |
| PUT | `/order/:orderId` | Atualizar pedido |
| DELETE | `/order/:orderId` | Deletar pedido |

---

## 📦 Exemplos de uso

### Criar pedido
```http
POST http://localhost:3000/order
Content-Type: application/json

{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.529Z",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
}
```

### Buscar pedido por ID
```http
GET http://localhost:3000/order/v10089015vdb-01
```

### Listar todos os pedidos
```http
GET http://localhost:3000/order/list
```

### Atualizar pedido
```http
PUT http://localhost:3000/order/v10089015vdb-01
Content-Type: application/json

{
  "valorTotal": 25000
}
```

### Deletar pedido
```http
DELETE http://localhost:3000/order/v10089015vdb-01
```

---

## 📖 Documentação Swagger

Com o servidor rodando, acesse:

```
http://localhost:3000/api-docs
```
