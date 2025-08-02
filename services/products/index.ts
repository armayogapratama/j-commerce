require("dotenv").config();
const fastify = require("fastify");
const cors = require("@fastify/cors");
const router = require("./routers/product.router");

const server = fastify();

server.register(cors, { origin: "*" });
server.register(router);

server.listen({ port: 3002 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
