import { AuthRequest, AuthResponse, RefreshTokenRequest } from "@business/auth/model"

export interface IAuthService{
    authenticate(request: AuthRequest, ipAddress: string): Promise<AuthResponse>
    authenticateByOAuth(email: string, ipAddress: string): Promise<AuthResponse>
    revokeByToken(refreshToken: RefreshTokenRequest, ipAddress: string): Promise<boolean>
    revokeByUserId(id: string, ipAddress: string): Promise<boolean>
    refreshToken(refreshToken: RefreshTokenRequest, ipAddress: string, out: (errorCode: number) => number): Promise<AuthResponse>
}
