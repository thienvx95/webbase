import { Container } from 'inversify';
import { COMMON_TYPES } from './index';
import { EventDispatcher } from '@business/core/events/eventDispatcher';
import { AutoMapper } from '@infrastructures/mapper/autoMapper';
import { SiteSettings } from '@business/system/service/siteSetting.service';
import { RedisCache } from '@infrastructures/caching/redis';
import { SystemConfig } from '@core/configuration';
import { CacheProvider } from '@core/enums/cacheProvider.enum';
import {
  IEventDispatcher,
  IAutoMapper,
  ISiteSettings,
  ICacheBase,
  ISiteSettingPage,
} from '@business/core/interface';
import { SiteSettingPage } from '@business/system/service/siteSettingPage.serivce';

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
    .toDynamicValue(() => SiteSettings.getInstance())
    .inSingletonScope();
  container
    .bind<ISiteSettingPage>(COMMON_TYPES.SiteSettingPage)
    .to(SiteSettingPage)
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
