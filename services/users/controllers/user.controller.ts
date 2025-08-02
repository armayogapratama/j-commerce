const {
  createUser,
  userByEmail,
  forgotPassword,
  resetPassword,
  createAdmin,
  userById,
} = require("../service/user.service");
const { signPassword, verifyPassword } = require("../helpers/hash");
const { signToken } = require("../helpers/jwt");
const { GlobalResponse } = require("../globals/responses/res");
const jwt = require("jsonwebtoken");

class UserController {
  static async createUser(req, reply) {
    try {
      const { email, password, name } = req.body;

      const userExists = await userByEmail(email);

      if (userExists) {
        return reply.send(GlobalResponse(null, "Error", "User already exists"));
      }

      const user = await createUser({
        name,
        email,
        password: signPassword(password),
      });

      reply.send(
        GlobalResponse(user, "Success", "User registered successfully")
      );
    } catch (error) {
      console.log(error);
    }
  }

  static async userByEmail(req, reply) {
    try {
      const { email } = req.params;

      const user = await userByEmail(email);

      reply.send(
        GlobalResponse(
          {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            created_at: user.created_at,
            updated_at: user.updated_at,
          },
          "Success",
          "Success get data"
        )
      );
    } catch (error) {
      console.log(error);
    }
  }

  static async loginUser(req, reply) {
    try {
      const { email, password } = req.body;

      const user = await userByEmail(email);

      if (!user || !verifyPassword(password, user.password)) {
        return reply.send(GlobalResponse(null, "Error", "Invalid credentials"));
      }

      const accessToken = await signToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      reply.send(
        GlobalResponse(accessToken, "Success", "User logged in successfully")
      );
    } catch (error) {
      console.log(error);
    }
  }

  static async forgotPassword(req, reply) {
    try {
      const { email } = req.body;

      const user = await userByEmail(email);

      if (!user) {
        return reply.send(GlobalResponse(null, "Error", "User not found"));
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      const resetLink = `http://localhost:3001/api/reset-password?token=${token}`;

      await forgotPassword({ email, resetLink });

      reply.send(
        GlobalResponse(
          { email, link: resetLink },
          "Success",
          "Reset password link sent successfully"
        )
      );
    } catch (error) {
      console.log(error);
    }
  }

  static async resetPassword(req, reply) {
    try {
      const { token, password, confirm } = req.body;

      const payload = jwt.verify(token, process.env.JWT_SECRET);

      if (!payload) {
        return GlobalResponse(null, "Error", "Token is not valid");
      }

      const user = await userByEmail(payload.email);

      if (!user) {
        return GlobalResponse(null, "Error", "User not found");
      }

      if (password !== confirm) {
        return GlobalResponse(null, "Error", "Passwords do not match");
      }

      const userUpdate = await resetPassword({ password, email: user.email });

      reply.send(
        GlobalResponse(userUpdate, "Success", "Password reset successfully")
      );
    } catch (error) {
      console.log(error);
    }
  }

  static async decodeToken(req, reply) {
    try {
      const { token } = req.body;

      const payload = jwt.verify(token, process.env.JWT_SECRET);

      if (!payload) {
        return GlobalResponse(null, "Error", "Token is not valid");
      }

      const user = await userByEmail(payload.email);

      if (!user) {
        return GlobalResponse(null, "Error", "User not found");
      }

      reply.send(GlobalResponse(user, "Success", "Token decoded successfully"));
    } catch (error) {
      console.log(error);
    }
  }

  static async registerAdmin(req, reply) {
    try {
      const { name, email, password, token } = req.body;

      const payload = jwt.verify(token, process.env.JWT_SECRET);

      if (!payload) {
        return GlobalResponse(null, "Error", "Token is not valid");
      }

      const user = await userByEmail(payload.email);

      if (user) {
        if (user.role === "admin") {
          return GlobalResponse(null, "Error", "User already have been admin");
        }
      }

      const admin = await createAdmin({
        name,
        email,
        password: signPassword(password),
      });

      reply.send(
        GlobalResponse(admin, "Success", "Admin registered successfully")
      );
    } catch (error) {
      console.log(error);
    }
  }

  static async userById(req, reply) {
    try {
      const { id } = req.params;

      const user = await userById(id);

      if (!user) {
        return reply.send(GlobalResponse(null, "Error", "User not found"));
      }

      reply.send(
        GlobalResponse(
          {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            created_at: user.created_at,
            updated_at: user.updated_at,
          },
          "Success",
          "Success get data"
        )
      );
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = UserController;
