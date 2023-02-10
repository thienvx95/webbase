import { injectable } from 'inversify';
import { ISiteSettingPage } from '@business/core/interface';
import { BaseSettingPage } from '../model/setting/base.setting';
import { PageSettingEnum } from '@core/enums/settingPage.enum';
import { LoginSettings } from '../model/setting/login/login.setting';
import { SiteSettings } from './siteSetting.service';
@injectable()
export class SiteSettingPage implements ISiteSettingPage {
  private _siteSetting: SiteSettings;
  constructor() {
    this._siteSetting = SiteSettings.getInstance();
  }
  getPageSettings(page: PageSettingEnum): BaseSettingPage {
    switch (page) {
      case PageSettingEnum.Login:
        return new LoginSettings(this._siteSetting);
      default:
        return null;
    }
  }
}
