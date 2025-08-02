const {
  createUser,
  loginUser,
  forgotPassword,
  resetPassword,
  decodeToken,
  userByEmail,
  registerAdmin,
  userById,
} = require("../controllers/user.controller");

async function router(fastify, options) {
  fastify.post("/api/users/register", createUser);
  fastify.post("/api/users/login", loginUser);
  fastify.post("/api/users/register-admin", registerAdmin);
  fastify.post("/api/users/forgot-password", forgotPassword);
  fastify.post("/api/users/decode-token", decodeToken);
  fastify.put("/api/users/reset-password", resetPassword);
  fastify.get("/api/users/user-email/:email", userByEmail);
  fastify.get("/api/users/user/:id", userById);
}

module.exports = router;
