const {
  productList,
  productCreate,
  productDetail,
  productUpdate,
  productDelete,
} = require("../controllers/product.controller");

async function router(fastify, options) {
  fastify.get("/api/products/lists", productList);
  fastify.post("/api/products/create", productCreate);
  fastify.get("/api/products/list/:id", productDetail);
  fastify.put("/api/products/update/:id", productUpdate);
  fastify.delete("/api/products/delete/:id", productDelete);
}

module.exports = router;
