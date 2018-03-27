// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/palette_picker',
    migrations: {
      directory: './db/migrations'
    }, 
    seeds: {
      directory: './db/seeds/dev'
    },
    setNullAsDefault: true
  },

  test: {
    client: 'pg',
    connection: 'postgres://localhost/palette_picker_test',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/test'
    },
    useNullAsDefault: true
  },

  production: {
    client: 'pg',
    connection: process.env.DATABSE_URL + `?ssl=true`,
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  }

};
