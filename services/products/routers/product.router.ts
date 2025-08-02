const {
  productList,
  productCreate,
  productDetail,
  productUpdate,
  productDelete,
  productStockUpdate,
} = require("../controllers/product.controller");

async function router(fastify, options) {
  fastify.get("/api/products/lists", productList);
  fastify.post("/api/products/create", productCreate);
  fastify.get("/api/products/list/:id", productDetail);
  fastify.put("/api/products/update/:id", productUpdate);
  fastify.patch("/api/products/stock/:id", productStockUpdate);
  fastify.delete("/api/products/delete/:id", productDelete);
}

module.exports = router;
