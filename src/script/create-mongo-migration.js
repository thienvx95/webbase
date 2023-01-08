const migrateMongo = require('migrate-mongo');
const migrateMongoConfig = require('./migrate-mongo-config');
const args = process.argv.slice(2);
const migrationName = args[0];

migrateMongo.config.set(migrateMongoConfig);
migrateMongo
    .create(migrationName)
    .then(fileName => {
        console.log(`Created: ${migrateMongoConfig.migrationsDir}/${fileName}`);
        process.exit(0);
    })
    .catch(err => {
        console.error(`ERROR: ${err.message}`);
        process.exit(1);
    });
