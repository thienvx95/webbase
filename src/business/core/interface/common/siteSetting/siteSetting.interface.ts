import { SettingValue } from "@entities/settings/setting.entity";

export interface ISiteSettings {
    get(_id: string, isReload?: boolean): SettingValue;
  }