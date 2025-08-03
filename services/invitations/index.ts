require("dotenv").config();
const fastify = require("fastify");
const cors = require("@fastify/cors");
const router = require("./routers/invitation.router");

const server = fastify();

server.register(cors, {
  origin: "*",
  methods: ["GET", "PUT", "POST", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Cache-Control",
  ],
});
server.register(router);

server.listen({ port: 3003 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
