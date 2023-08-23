import { ILoader, ISettings } from '@microframework';
import { SystemConfig } from '@core/configuration';
import { CacheProvider } from '@core/enums/cacheProvider.enum';
import { RedisCache } from '@infrastructures/caching/redis';
import { MemoryCache } from '@infrastructures/caching/memory';

export const CacheLoader: ILoader = async (settings: ISettings | undefined) => {
  if (settings) {
    const configs = SystemConfig.Configs;
    await MemoryCache.getInstance().init();
    if (configs.CacheProvider == CacheProvider.Redis) {
      await RedisCache.getInstance().init();
    }
  }
};
