import { SiteSettings } from '@business/system/service/siteSetting.service';
import { PageSettingEnum } from '@core/enums/settingPage.enum';
import { BaseSettingPage } from '../base.setting';

export class LoginSettings extends BaseSettingPage {
  constructor(instance: SiteSettings) {
    super();
    this.enableGoogleAuth = instance.get('Google_Login');
    if (this.enableGoogleAuth) {
      this.googleClientId = instance.get('Google_Id');
    }
    this.enableGoogleAuth = instance.get('Facebook_Login');
    this.type = PageSettingEnum.Login;
  }
  enableGoogleAuth: boolean;
  googleClientId: string;
  enableFacebookAuth: boolean;
  enableRembemerAuth: boolean;
  enableForgotPassword: boolean;
}
