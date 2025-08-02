const {
  createUser,
  loginUser,
  forgotPassword,
  resetPassword,
  decodeToken,
} = require("../controllers/user.controller");

async function router(fastify, options) {
  fastify.post("/api/users/register", createUser);
  fastify.post("/api/users/login", loginUser);
  fastify.post("/api/users/forgot-password", forgotPassword);
  fastify.post("/api/users/decode-token", decodeToken);
  fastify.put("/api/users/reset-password", resetPassword);
}

module.exports = router;
