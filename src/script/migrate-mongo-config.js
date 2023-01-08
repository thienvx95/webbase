var path = require('app-root-path')
const pathEnv = `${path}/.env${
  process.env.NODE_ENV === 'production' ? '.production' : '.dev'
}`;
require('dotenv').config({ path: pathEnv });

module.exports = {
  mongodb: {
    url: process.env.CONNECTION_URL,
    databaseName: process.env.DB_NAME,
    options: {
      useNewUrlParser: true, // removes a deprecation warning when connecting
      useUnifiedTopology: true, // removes a deprecating warning when connecting
      //   connectTimeoutMS: 3600000, // increase connection timeout to 1 hour
      //   socketTimeoutMS: 3600000, // increase socket timeout to 1 hour
    },
  },

  // The migrations dir, can be an relative or absolute path. Only edit this when really necessary.
  migrationsDir: 'src/migrations',

  // The mongodb collection where the applied changes are stored. Only edit this when really necessary.
  changelogCollectionName: 'migrationDb',

  // The file extension to create migrations and search for in migration dir
  migrationFileExtension: '.js',
};
