/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => {
  return knex.schema
  .alterTable("weather_log", (table) => {
    table.text("log").alter()
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => {
  return knex.schema
  .alterTable("weather_log", (table) => {
    table.string("log").alter()
  })
};
