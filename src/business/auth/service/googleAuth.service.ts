import { IGoogleAuthService, ISiteSettings } from '@business/core/interface';
import { COMMON_TYPES } from '@infrastructures/modules';
import { OAuth2Client, LoginTicket } from 'google-auth-library';
import { GetTokenResponse } from 'google-auth-library/build/src/auth/oauth2client';
import { inject, injectable } from 'inversify';

@injectable()
export class GoogleAuthService implements IGoogleAuthService {
  private googleAuthClient: OAuth2Client;
  constructor(
    @inject(COMMON_TYPES.SiteSettings) private siteSettings: ISiteSettings,
  ) {}

  private initGooogleSerivce = (): void => {
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
  };

  async getToken(code: string): Promise<GetTokenResponse> {
    this.initGooogleSerivce();
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
