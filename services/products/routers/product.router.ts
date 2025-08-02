import axios = require("axios");

const {
  productList,
  productCreate,
  productDetail,
  productUpdate,
  productDelete,
  productStockUpdate,
  softDelete,
} = require("../controllers/product.controller");
const { GlobalResponse } = require("../globals/responses/res");
const { verifyToken } = require("../helpers/jwt");

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

  fastify.get("/api/products/lists", productList);
  fastify.post("/api/products/create", productCreate);
  fastify.get("/api/products/list/:id", productDetail);
  fastify.put("/api/products/update/:id", productUpdate);
  fastify.patch("/api/products/stock/:id", productStockUpdate);
  fastify.delete("/api/products/delete/:id", productDelete);
  fastify.put("/api/products/soft-delete/:id", softDelete);
}

module.exports = router;
