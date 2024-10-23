/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => {
  return knex.schema.createTable("accounts", (table) => {
    table.increments("id").unique().primary();
    table.string("username").unique();
    table.string("password");
    table.string("email").unique();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => {
  return knex.schema.dropTableIfExists("accounts");
};
