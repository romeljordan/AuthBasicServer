module.exports = {
  development: {
    client: "mysql",
    connection: {
      host: "sql12.freesqldatabase.com",
      user: "sql12738171",
      password: "fBzu7MxYPR",
      database: "sql12738171",
      port: 3306,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: `${__dirname}/migrations`,
    },
    seeds: {
      tableName: `knex_seeds`,
      directory: `${__dirname}/seeds`,
    },
  },
  production: {
    client: "mysql",
    connection: {
      host: "sql12.freesqldatabase.com",
      user: "sql12738171",
      password: "fBzu7MxYPR",
      database: "sql12738171",
      port: 3306,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: `${__dirname}/migrations`,
    },
    seeds: {
      tableName: `knex_seeds`,
      directory: `${__dirname}/seeds`,
    },
  },
};
