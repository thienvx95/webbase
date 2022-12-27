import { Container } from "typedi";

import { SiteSettings, ISiteSettings } from "@infrastructures/siteSetting";

export function SiteSettingDecorator(): ParameterDecorator {
  return (object: any, propertyName: string, index?: number): any => {
    Container.registerHandler({
      object,
      propertyName,
      index,
      value: () => SiteSettings.getInstance(),
    });
  };
}

export { ISiteSettings };
