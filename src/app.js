const connectDB = require("./config/mongoose");

// conecta ao banco
connectDB();

// controlador de rotas
const orderRoutes = require("./routes/orderRoutes");

module.exports = async (req, res) => {

  res.setHeader("Content-Type", "application/json");

  await orderRoutes(req, res);

};