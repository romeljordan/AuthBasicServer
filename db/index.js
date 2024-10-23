const engine = process.env.NODE_ENV || "development";
const config = require("./knexfile")[engine];

module.exports = require("knex")(config);
