import { ISiteSettings } from '@business/core/interface/common/siteSetting/siteSetting.interface';
import { Setting, SettingValue } from '@entities/settings/setting.entity';
import { getModelForClass, ReturnModelType } from '@typegoose/typegoose';
import { BeAnObject } from '@typegoose/typegoose/lib/types';
import { injectable } from 'inversify';
import { isEmpty } from 'lodash';

@injectable()
export class SiteSettings implements ISiteSettings {
  private _cache = new Map<string, SettingValue>();
  private _settingModel: ReturnModelType<typeof Setting, BeAnObject>;
  private static _instance: SiteSettings;
  constructor() {
    this._settingModel = getModelForClass(Setting);
    this.init();
  }

  public static getInstance(): SiteSettings {
    if (!SiteSettings._instance) {
      SiteSettings._instance = new SiteSettings();
    }

    return SiteSettings._instance;
  }

  public init(): void {
    this._settingModel.find(
      { type: { $nin: ['section', 'group'] } },
      (_err, data) => {
        if (!isEmpty(data)) {
          data.forEach((record: Setting) => {
            this.setValue(record._id, record.value);
          });
        }
      },
    );
  }

  public get<T>(_id: string, isReload = false): T {
    return this.getValue(_id, isReload) as T;
  }

  private setValue = (_id: string, value: SettingValue): void => {
    this._cache.set(_id, value);
  };

  private setFromDB = async (_id: string): Promise<void> => {
    const result = await this._settingModel.findById(_id, {
      fields: { value: 1 },
    });
    if (result != null) {
      this.setValue(_id, result.toObject());
    }
  };

  private getValue = (_id: string, isReload = false): SettingValue => {
    if (!this._cache.has(_id) || isReload) {
      this.setFromDB(_id);
      return this._cache.get(_id);
    }

    return this._cache.get(_id);
  };
}
