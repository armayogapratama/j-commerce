const bcrypt = require("bcryptjs");

function signPassword(password: string) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  return hash;
}

function verifyPassword(planPass: string, hash: string) {
  return bcrypt.compareSync(planPass, hash);
}

module.exports = {
  signPassword,
  verifyPassword,
};
