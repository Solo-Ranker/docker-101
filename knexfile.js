module.exports = {
    development: {
      client: 'pg',
      connection: {
        host: 'localhost',
        user: 'your_pg_user',
        password: 'your_pg_password',
        database: 'your_database'
      },
      migrations: {
        directory: './migrations'
      },
      seeds: {
        directory: './seeds'
      }
    }
  };