API REST para gerenciamento de pedidos.

## Tecnologias

- Node.js
- MongoDB Atlas

## Como executar

1. Instale as dependências:
	 - `npm install`
2. Configure o arquivo `.env` com sua `MONGODB_URI`.
3. Inicie a API:
	 - `npm start`

## Endpoints

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

- `201`: pedido criado
- `200`: consulta/atualização/remoção com sucesso
- `400`: JSON inválido
- `404`: pedido não encontrado
- `409`: pedido duplicado
- `500`: erro interno

## Exemplo de teste no PowerShell (Windows)

```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:3000/order" -ContentType "application/json" -Body '{"numeroPedido":"v10089015vdb-01","valorTotal":10000,"dataCriacao":"2023-07-19T12:24:11.5299601+00:00","items":[{"idItem":"2434","quantidadeItem":1,"valorItem":1000}]}'
```