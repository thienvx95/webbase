import { ILoader, ISettings } from '@microframework';
import { SystemConfig } from '@core/configuration';
import { CacheProvider } from '@core/enums/cacheProvider.enum.';
import { RedisCache } from '@infrastructures/caching/redis';

export const CacheLoader: ILoader = async (
  settings: ISettings | undefined,
) => {
  if (settings) {
    const configs = SystemConfig.Configs;
    if (configs.CacheProvider == CacheProvider.Redis) {
      const cacheInstance = RedisCache.getInstance();
      await cacheInstance.init();
    }
  }
};
