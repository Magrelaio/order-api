// Router manual para lidar com as rotas relacionadas a pedidos. Ele verifica o método HTTP e a URL para direcionar a requisição para a função apropriada no controlador de pedidos.

const {
  createOrder,
  getOrder,
  listOrders,
  updateOrder,
  deleteOrder
} = require("../controllers/orderController");
const { login } = require("../controllers/authController");
const authenticateToken = require("../middlewares/authMiddleware");

module.exports = async (req, res) => {

  const url = req.url.split("?")[0];
  const method = req.method;

  if (method === "POST" && url === "/auth/login") {
    return login(req, res);
  }

  if (url.startsWith("/order") && !authenticateToken(req, res)) {
    return;
  }

  if (method === "POST" && url === "/order") {
    return createOrder(req, res);
  }

  if (method === "GET" && url.startsWith("/order/list")) {
    return listOrders(req, res);
  }

  if (method === "GET" && url.startsWith("/order/")) {
    const id = url.split("/")[2];
    return getOrder(req, res, id);
  }

  if (method === "PUT" && url.startsWith("/order/")) {
    const id = url.split("/")[2];
    return updateOrder(req, res, id);
  }

  if (method === "DELETE" && url.startsWith("/order/")) {
    const id = url.split("/")[2];
    return deleteOrder(req, res, id);
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ message: "Route not found" }));
};