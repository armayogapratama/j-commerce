import axios = require("axios");
const { verifyToken } = require("../helpers/jwt");
const {
  orderLists,
  createOrder,
  orderByUser,
} = require("../controllers/order.controller");
const { GlobalResponse } = require("../globals/responses/res");

async function router(fastify, options) {
  fastify.addHook("preHandler", async (request, reply) => {
    try {
      const authHeader = request.headers.authorization;

      if (!authHeader) {
        reply.send(
          GlobalResponse(null, "Error", "Authorization token is required")
        );
        return;
      }

      const [bearer, accessToken] = authHeader.split(" ");

      if (bearer !== "Bearer") {
        reply.send(GlobalResponse(null, "Error", "Invalid or expired token"));
        return;
      }

      const payload = verifyToken(accessToken);

      const user = await axios.get(
        `${process.env.USER_URL}/api/users/user/${payload.id}`
      );

      const response = user.data.data;

      request.user = {
        id: response.id,
        name: response.name,
        email: response.email,
        role: response.role,
      };

      // return true;
    } catch (err) {
      reply.send(GlobalResponse(null, "Error", "Invalid or expired token"));
    }
  });

  fastify.get("/api/orders/lists", orderLists);
  fastify.post("/api/orders/create", createOrder);
  fastify.get("/api/orders/user-lists", orderByUser);
}

module.exports = router;
