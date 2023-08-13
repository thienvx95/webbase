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
    this.enableFacebookAuth = instance.get('Facebook_Login');
    if (this.enableFacebookAuth) {
      this.facebookeClientId = instance.get('Facebook_Id');
    }

    this.type = PageSettingEnum.Login;
  }
  enableGoogleAuth: boolean | false = false;
  googleClientId: string | null = null;
  enableFacebookAuth: boolean | false = false;
  facebookeClientId: string | null = null;
  enableRembemerAuth: boolean | false = false;
  enableForgotPassword: boolean | false = false;
}
