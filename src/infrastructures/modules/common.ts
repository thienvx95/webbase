import { Container } from "inversify";
import { EventDispatcher, IEventDispatcher } from "@infrastructures/events/eventDispatcher";
import { AutoMapper, IAutoMapper } from "@infrastructures/mapper/autoMapper";
import { SiteSettings, ISiteSettings } from "@infrastructures/siteSetting";
import { ICacheBase } from "@infrastructures/caching/cacheBase.interface";
import { RedisCache } from "@infrastructures/caching/redis";
import { SystemConfig } from "@core/configuration";
import { CacheProvider } from "@core/enums/cacheProvider.enum.";

export const COMMON_TYPES = {
    EventDispatcher: Symbol.for("EventDispatcher"),
    AutoMapper: Symbol.for("AutoMapper"),
    SiteSettings: Symbol.for("SiteSettings"),
    MemoryCache: Symbol.for("MemoryCache"), 
};

export function common(container: Container): void {
    container.bind<IEventDispatcher>(COMMON_TYPES.EventDispatcher).to(EventDispatcher);
    container.bind<IAutoMapper>(COMMON_TYPES.AutoMapper).toDynamicValue(() => AutoMapper.getInstance()).inSingletonScope();
    container.bind<ISiteSettings>(COMMON_TYPES.SiteSettings).to(SiteSettings).inSingletonScope();
    container.bind<ICacheBase>(COMMON_TYPES.MemoryCache).toDynamicValue(() => {
        if(SystemConfig.CacheProvider == CacheProvider.Redis){
            return RedisCache.getInstance();
        }
        return null;
    }).inSingletonScope();
}

export { IEventDispatcher, IAutoMapper, ISiteSettings }