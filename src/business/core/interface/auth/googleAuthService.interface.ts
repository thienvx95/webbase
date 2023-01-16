import { LoginTicket } from 'google-auth-library';
import { GetTokenResponse } from 'google-auth-library/build/src/auth/oauth2client';

export interface IGoogleAuthService {
    getToken(code: string): Promise<GetTokenResponse>;
    verifyToken(token: string): Promise<LoginTicket>;
  }