import type { Knex } from "knex";

const invitationDDL = `
CREATE TABLE "invitations" (
  "id" SERIAL PRIMARY KEY,
  "token" CHAR(1000) UNIQUE NOT NULL,
  "user_id" INT NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);`;

async function up(knex: Knex): Promise<void> {
  return await knex.raw(invitationDDL);
}

async function down(knex: Knex): Promise<void> {
  return await knex.raw(`DROP TABLE IF EXISTS "invitations";`);
}

module.exports = {
  up,
  down,
};
