// função de mapeamento, que transforma os dados recebidos da API em um formato mais adequado para o armazenamento no banco de dados.
module.exports = (body) => {

  const rawOrderId = String(body.numeroPedido || "").trim();
  const normalizedOrderId = rawOrderId.replace(/-\d+$/, "");

  return {
    orderId: normalizedOrderId,
    value: body.valorTotal,
    creationDate: new Date(body.dataCriacao),
    items: body.items.map(item => ({
      productId: Number(item.idItem),
      quantity: item.quantidadeItem,
      price: item.valorItem
    }))
  };

};