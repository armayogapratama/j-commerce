const jwt = require("jsonwebtoken");

const secret_key = (process.env.JWT_SECRET as string) || "juarakampung";

function signToken(payload) {
  const token = jwt.sign(payload, secret_key);
  return token;
}

function verifyToken(token: string) {
  const payload = jwt.verify(token, secret_key);
  return payload;
}

module.exports = {
  signToken,
  verifyToken,
};
