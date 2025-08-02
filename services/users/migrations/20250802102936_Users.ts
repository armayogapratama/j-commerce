import type { Knex } from "knex";

const userDDL = `
CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "role" VARCHAR(255) NOT NULL DEFAULT 'buyer',
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);`;

async function up(knex: Knex): Promise<void> {
  return await knex.raw(userDDL);
}

async function down(knex: Knex): Promise<void> {
  return await knex.raw(`DROP TABLE IF EXISTS "users";`);
}

module.exports = {
  up,
  down,
};
