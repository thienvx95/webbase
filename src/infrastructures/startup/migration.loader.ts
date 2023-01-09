import { ILoader, ISettings } from '@microframework';
import MongoMigration from '@infrastructures/migration/mongoMigration';
import { DbProvider } from '@core/enums/dbProvider.enum';
import { ISystemConfig } from '@core/configuration';

export const MigrationLoader: ILoader = async (
  settings: ISettings | undefined,
) => {
  if (settings) {
    const configs = settings.getData<ISystemConfig>('configs');
    if (configs.DataSettings.DbProvider == DbProvider.MongoDB) {
      await MongoMigration.run();
    }
  }
};
