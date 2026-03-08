// controlador de rotas, onde as requisições são recebidas e direcionadas para as funções adequadas.

const Order = require("../models/Order");
const mapOrder = require("../utils/orderMapper");

async function getBody(req) {
  return new Promise((resolve) => {

    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        resolve(null);
      }
    });

  });
}

exports.createOrder = async (req, res) => {

  try {
    const body = await getBody(req);

    if (!body) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ message: "Invalid JSON" }));
    }

    // Transforma os dados usando o mapper
    const orderData = mapOrder(body);

    // Salva no MongoDB
    const order = new Order(orderData);
    await order.save();

    res.statusCode = 201;
    res.end(JSON.stringify(order));
  } catch (error) {
    console.error("Error creating order:", error);

    if (error && error.code === 11000) {
      res.statusCode = 409;
      return res.end(JSON.stringify({ message: "Order already exists" }));
    }

    res.statusCode = 500;
    res.end(JSON.stringify({ message: "Error creating order", error: error.message }));
  }
};

exports.getOrder = async (req, res, id) => {

  try {
    // Busca pelo orderId no MongoDB
    const order = await Order.findOne({ orderId: id });

    if (!order) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ message: "Order not found" }));
    }

    res.statusCode = 200;
    res.end(JSON.stringify(order));
  } catch (error) {
    console.error("Error getting order:", error);
    res.statusCode = 500;
    res.end(JSON.stringify({ message: "Error getting order", error: error.message }));
  }
};

exports.listOrders = async (req, res) => {

  try {
    // Lista todos os pedidos do MongoDB
    const orders = await Order.find();

    res.statusCode = 200;
    res.end(JSON.stringify(orders));
  } catch (error) {
    console.error("Error listing orders:", error);
    res.statusCode = 500;
    res.end(JSON.stringify({ message: "Error listing orders", error: error.message }));
  }
};

exports.updateOrder = async (req, res, id) => {

  try {
    const body = await getBody(req);

    if (!body) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ message: "Invalid JSON" }));
    }

    // Transforma os dados usando o mapper
    const orderData = mapOrder(body);

    // Atualiza no MongoDB
    const order = await Order.findOneAndUpdate(
      { orderId: id },
      orderData,
      { new: true }
    );

    if (!order) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ message: "Order not found" }));
    }

    res.statusCode = 200;
    res.end(JSON.stringify(order));
  } catch (error) {
    console.error("Error updating order:", error);
    res.statusCode = 500;
    res.end(JSON.stringify({ message: "Error updating order", error: error.message }));
  }
};

exports.deleteOrder = async (req, res, id) => {

  try {
    // Deleta do MongoDB
    const order = await Order.findOneAndDelete({ orderId: id });

    if (!order) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ message: "Order not found" }));
    }

    res.statusCode = 200;
    res.end(JSON.stringify({ message: "Order deleted", order }));
  } catch (error) {
    console.error("Error deleting order:", error);
    res.statusCode = 500;
    res.end(JSON.stringify({ message: "Error deleting order", error: error.message }));
  }
};