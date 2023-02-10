import {
  AuthRequest,
  AuthResponse,
  RefreshTokenRequest,
  Session,
} from '@business/auth/model';

export interface IAuthService {
  authenticate(request: AuthRequest, session: Session): Promise<AuthResponse>;
  authenticateByOAuth(email: string, session: Session): Promise<AuthResponse>;
  revokeByToken(
    refreshToken: RefreshTokenRequest,
    ipAddress: string,
  ): Promise<boolean>;
  revokeByUserId(id: string, ipAddress: string): Promise<boolean>;
  refreshToken(
    refreshToken: RefreshTokenRequest,
    ipAddress: string,
    out: (errorCode: number) => void,
  ): Promise<AuthResponse>;
}
