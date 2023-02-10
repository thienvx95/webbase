import { BaseSettingPage } from '@business/system/model/setting/base.setting';
import { PageSettingEnum } from '@core/enums/settingPage.enum';

export interface ISiteSettingPage {
  getPageSettings(page: PageSettingEnum): BaseSettingPage;
}
