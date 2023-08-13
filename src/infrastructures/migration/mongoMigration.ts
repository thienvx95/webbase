import { Logging } from '@core/log';
import * as MigrateMongo from 'migrate-mongo';
import * as config from 'script/migrate-mongo-config.js';
import { IMigration } from './migration.interface';

class MongoMigration implements IMigration {
  private _log = Logging.getInstance('MongoMigration');
  private migrationMongo = MigrateMongo;
  private mỉgationConfig = config as unknown as MigrateMongo.config.Config;
  constructor() {
    this.migrationMongo.config.set(this.mỉgationConfig);
  }
  async run(): Promise<void> {
    const { db, client } = await this.migrationMongo.database.connect();
    const migrationStatus = await this.migrationMongo.status(db);
    let needRunMigration = true;
    migrationStatus.forEach(({ fileName, appliedAt }) => {
      if (appliedAt == 'Pending') {
        needRunMigration = true;
      }
      this._log.info(`Migration Status: ${fileName} : ${appliedAt}`);
    });
    if (needRunMigration) {
      const migrated = await this.migrationMongo.up(db, client);
      migrated.forEach((fileName) => {
        this._log.info(`Migrated: ${fileName}`);
      });
    }

    // const migratedDown = await this.migrationMongo.down(db, client);
    // migratedDown.forEach(fileName => {
    //     this._log.info(`Migrated Down:: ${fileName}`);
    // });

    await client.close();
  }
}

export default new MongoMigration();
