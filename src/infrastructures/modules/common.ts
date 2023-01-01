import { Container } from "inversify";
import { EventDispatcher, IEventDispatcher } from "@infrastructures/events/eventDispatcher";
import { AutoMapper, IAutoMapper } from "@infrastructures/mapper/autoMapper";
import { SiteSettings, ISiteSettings } from "@infrastructures/siteSetting";

export const COMMON_TYPES = {
    EventDispatcher: Symbol.for("EventDispatcher"),
    AutoMapper: Symbol.for("AutoMapper"),
    SiteSettings: Symbol.for("SiteSettings"),
};

export function common(container: Container): void {
    container.bind<IEventDispatcher>(COMMON_TYPES.EventDispatcher).to(EventDispatcher);
    container.bind<IAutoMapper>(COMMON_TYPES.AutoMapper).toDynamicValue(() => AutoMapper.getInstance()).inSingletonScope();
    container.bind<ISiteSettings>(COMMON_TYPES.SiteSettings).to(SiteSettings).inSingletonScope();
}

export { IEventDispatcher, IAutoMapper, ISiteSettings }