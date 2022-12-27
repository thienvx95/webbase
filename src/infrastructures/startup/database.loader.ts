import { ILoader, ISettings } from '@microframework';
import { MongoDatabase } from '@core/data/mongoDb/mongo.database';
import { SystemConfig } from '@core/configuration';
import { DbProvider } from '@core/enums/dbProvider.enum';
import { SiteSettings } from '@infrastructures/siteSetting';
import { Application } from '@infrastructures/applicationInfo';

export const DatabaseLoader: ILoader = async (
  settings: ISettings | undefined,
) => {
  if (settings) {
    const configs = SystemConfig.Configs;
    if (configs.DataSettings.DbProvider == DbProvider.MongoDB) {
      const mongoInstance = MongoDatabase.getInstance();
      await mongoInstance.init();
      SystemConfig.SetDatabaseVersion(mongoInstance.MongoVersion);
    }
    await Application.getInstance().init();
    await SiteSettings.getInstance().init();

    settings.setData('configs', configs);
  }
};
