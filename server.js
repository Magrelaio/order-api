// criação basica de um servidor HTTP, usando o módulo nativo do Node.js.

const http = require("http");
const app = require("./src/app");

const server = http.createServer(app);

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});