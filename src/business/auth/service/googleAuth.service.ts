import { Service } from 'typedi';

import {
  ISiteSettings,
  SiteSettingDecorator,
} from '@infrastructures/decorators/siteSetting.decorator';
import { OAuth2Client, LoginTicket } from 'google-auth-library';
import { GetTokenResponse } from 'google-auth-library/build/src/auth/oauth2client';

export interface IGoogleAuthService {
  getToken(code: string): Promise<GetTokenResponse>;
  verifyToken(token: string): Promise<LoginTicket>;
}
@Service()
export class GoogleAuthService implements IGoogleAuthService {
  private googleAuthClient: OAuth2Client;
  constructor(@SiteSettingDecorator() private siteSettings: ISiteSettings) {
    const googleId = this.siteSettings.get('Google_Id') as string;
    const googleCallBack = this.siteSettings.get(
      'Google_Callback_URL',
    ) as string;
    const googleSecret = this.siteSettings.get('Google_Secret') as string;
    this.googleAuthClient = new OAuth2Client({
      clientId: googleId,
      clientSecret: googleSecret,
      redirectUri: googleCallBack,
    });
  }

  async getToken(code: string): Promise<GetTokenResponse> {
    return await this.googleAuthClient.getToken(code);
  }

  async verifyToken(token: string): Promise<LoginTicket> {
    const googleId = this.siteSettings.get('Google_Id') as string;
    return await this.googleAuthClient.verifyIdToken({
      idToken: token,
      audience: googleId,
    });
  }
}
