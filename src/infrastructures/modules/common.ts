import { Container } from 'inversify';
import { COMMON_TYPES } from './index';
import {
  EventDispatcher,
  IEventDispatcher,
} from '@business/core/events/eventDispatcher';
import { AutoMapper, IAutoMapper } from '@infrastructures/mapper/autoMapper';
import { SiteSettings, ISiteSettings } from '@business/common/service/siteSetting';
import { ICacheBase } from '@infrastructures/caching/cacheBase.interface';
import { RedisCache } from '@infrastructures/caching/redis';
import { SystemConfig } from '@core/configuration';
import { CacheProvider } from '@core/enums/cacheProvider.enum.';

export function common(container: Container): void {
  container
    .bind<IEventDispatcher>(COMMON_TYPES.EventDispatcher)
    .to(EventDispatcher);
  container
    .bind<IAutoMapper>(COMMON_TYPES.AutoMapper)
    .toDynamicValue(() => AutoMapper.getInstance())
    .inSingletonScope();
  container
    .bind<ISiteSettings>(COMMON_TYPES.SiteSettings)
    .to(SiteSettings)
    .inSingletonScope();
  container
    .bind<ICacheBase>(COMMON_TYPES.MemoryCache)
    .toDynamicValue(() => {
      if (SystemConfig.CacheProvider == CacheProvider.Redis) {
        return RedisCache.getInstance();
      }
      return null;
    })
    .inSingletonScope();
}