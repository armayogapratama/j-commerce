import type { Knex } from "knex";

const orderDDL = `
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  total DECIMAL(1000, 3) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

async function up(knex: Knex): Promise<void> {
  return await knex.raw(orderDDL);
}

async function down(knex: Knex): Promise<void> {
  return await knex.raw(`DROP TABLE IF EXISTS "orders";`);
}

module.exports = {
  up,
  down,
};
