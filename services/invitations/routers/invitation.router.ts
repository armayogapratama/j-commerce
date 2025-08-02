import axios = require("axios");

const {
  invitationLists,
  invitationCreate,
} = require("../controllers/invitation.controller");
const { verifyToken } = require("../helpers/jwt");

async function router(fastify, options) {
  fastify.addHook("preHandler", async (request, reply) => {
    if (request.routerPath === "/api/invitations/lists") {
      return;
    }

    try {
      const authHeader = request.headers.authorization;

      if (!authHeader) {
        reply.code(401).send({ message: "Authorization token is required" });
        return;
      }

      const [bearer, accessToken] = authHeader.split(" ");

      if (bearer !== "Bearer") {
        reply.code(401).send({ message: "Invalid or expired token" });
        return;
      }

      const payload = verifyToken(accessToken);

      const user = await axios.get(
        `${process.env.BASE_URL}/api/users/user/${payload.id}`
      );

      const response = user.data.data;

      request.user = {
        id: response.id,
        email: response.email,
        role: response.role,
      };

      // return true;
    } catch (err) {
      reply.code(401).send({ message: "Invalid or expired token" });
    }
  });

  fastify.get("/api/invitations/lists", invitationLists);
  fastify.post("/api/invitations/create", invitationCreate);
}

module.exports = router;
