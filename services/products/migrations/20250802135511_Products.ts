import type { Knex } from "knex";

const productDDL = `
CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      stock INT DEFAULT 0,
      status BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP DEFAULT NULL
);`;

async function up(knex: Knex): Promise<void> {
  return await knex.raw(productDDL);
}

async function down(knex: Knex): Promise<void> {
  return await knex.raw(`DROP TABLE IF EXISTS "products";`);
}

module.exports = {
  up,
  down,
};
