API REST para gerenciamento de pedidos.

## Tecnologias

- Node.js
- MongoDB Atlas + Mongoose
- JWT
- Dotenv

## Como executar

1. Instale as dependências:
   - `npm install`
2. Configure o arquivo `.env` com:
   - `MONGODB_URI`
   - `AUTH_USERNAME`
   - `AUTH_PASSWORD`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN` (opcional, exemplo: `7d`)
3. Inicie a API:
   - `npm start`

Saída esperada no terminal:

- `Server running on http://localhost:3000`
- `MongoDB conectado com Mongoose`

## Exemplo de `.env`

```env
PORT=3000
MONGODB_URI=URI_DO_SEU_BANCO_DE_DADOS_MONGODB
AUTH_USERNAME=admin
AUTH_PASSWORD=admin123
JWT_SECRET=SEU_SEGREDO_JWT_SUPER_SECRETO_2026
JWT_EXPIRES_IN=7d
```

Gerar `JWT_SECRET` forte:

```powershell e linux
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Autenticação básica com JWT

### Login

- Endpoint: `POST /auth/login`
- URL: `http://localhost:3000/auth/login`
- Body:

```json
{
  "username": "admin",
  "password": "admin123"
}
```

Resposta:

```json
{
  "token": "<JWT>",
  "tokenType": "Bearer",
  "expiresIn": "7d"
}
```

Todas as rotas `/order*` exigem header:

```http
Authorization: Bearer <JWT>
```

## Como usar no Postman

1. Crie uma requisição `POST http://localhost:3000/auth/login`
2. Em `Body > raw > JSON`, envie usuário e senha
3. Clique em `Send` e copie o `token`
4. Nas requisições `/order*`, vá em `Authorization`:
   - Type: `Bearer Token`
   - Token: cole o JWT

Opcional (automático): salvar token em variável de ambiente no `Tests` do login:

```javascript
const response = pm.response.json();
pm.environment.set("jwt_token", response.token);
```

Depois, nas outras requisições, use `Bearer {{jwt_token}}`.

## Endpoints

### Público

- `POST /auth/login`

### Protegidos (Bearer Token obrigatório)

### Criar pedido

- `POST /order`
- URL: `http://localhost:3000/order`

Body de entrada:

```json
{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
}
```

Mapping salvo no banco:

```json
{
  "orderId": "v10089015vdb",
  "value": 10000,
  "creationDate": "2023-07-19T12:24:11.529Z",
  "items": [
    {
      "productId": 2434,
      "quantity": 1,
      "price": 1000
    }
  ]
}
```

### Obter pedido por número

- `GET /order/:id`
- URL: `http://localhost:3000/order/v10089015vdb`

### Listar todos os pedidos

- `GET /order/list`
- URL: `http://localhost:3000/order/list`

### Atualizar pedido

- `PUT /order/:id`
- URL: `http://localhost:3000/order/v10089015vdb`

### Deletar pedido

- `DELETE /order/:id`
- URL: `http://localhost:3000/order/v10089015vdb`

## Status HTTP

- `200`: sucesso (consulta, atualização, remoção e login)
- `201`: pedido criado
- `400`: JSON inválido
- `401`: não autorizado (sem token, token inválido/expirado ou credenciais inválidas)
- `404`: rota não encontrada ou pedido não encontrado
- `409`: pedido duplicado
- `500`: erro interno

## Exemplos de teste no PowerShell (Windows)

Login e captura do token:

```powershell
$login = Invoke-RestMethod -Method POST -Uri "http://localhost:3000/auth/login" -ContentType "application/json" -Body '{"username":"admin","password":"admin123"}'
$token = $login.token
```

Listar pedidos autenticado:

```powershell
Invoke-RestMethod -Method GET -Uri "http://localhost:3000/order/list" -Headers @{ Authorization = "Bearer $token" }
```

Criar pedido autenticado:

```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:3000/order" -ContentType "application/json" -Headers @{ Authorization = "Bearer $token" } -Body '{"numeroPedido":"v10089015vdb-01","valorTotal":10000,"dataCriacao":"2023-07-19T12:24:11.5299601+00:00","items":[{"idItem":"2434","quantidadeItem":1,"valorItem":1000}]}'
```

## Troubleshooting

### `Error: listen EADDRINUSE: address already in use :::3000`

Já existe outro processo usando a porta 3000.

```powershell
Stop-Process -Name node -Force
npm start
```

```linux
lsof -i :3000
kill -9 <PID>
```

### `401 Unauthorized` em `/order/list`

- Gere token em `POST /auth/login`
- Envie `Authorization: Bearer <token>`
- Verifique se o token não expirou

### `Route not found`

- Confirme método e URL corretos
- Exemplo válido: `GET http://localhost:3000/order/list`
- Garanta que só uma instância da API está rodando na porta 3000