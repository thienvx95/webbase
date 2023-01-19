import {
  Post,
  JsonController,
  Body,
  Req,
  Get,
  Param,
} from 'routing-controllers';
import { Request } from 'express';
import { ResponseSchema } from 'routing-controllers-openapi';
import {
  AuthRequest,
  AuthResponse,
  GoogleAuthRequest,
  RefreshTokenRequest,
} from '@business/auth/model';
import { inject, injectable } from 'inversify';
import { SERVICE_TYPES } from '@infrastructures/modules';
import { IAuthService, IGoogleAuthService, IUserService } from '@business/core/interface';
import { RoutingAPI } from '@core/constants';

@injectable()
@JsonController(RoutingAPI.Auth)
export class AuthController {
  constructor(
    @inject(SERVICE_TYPES.AuthService) private authService: IAuthService,
    @inject(SERVICE_TYPES.GoogleAuthService) private googleAuthService: IGoogleAuthService,
    @inject(SERVICE_TYPES.UserService) private userService: IUserService,
  ) {}

  @Post()
  @ResponseSchema(AuthResponse)
  async authenticate(
    @Req() req: Request,
    @Body() auth: AuthRequest,
  ): Promise<AuthResponse> {
    return await this.authService.authenticate(auth, req.ip);
  }

  @Post('/google')
  @ResponseSchema(AuthResponse)
  async google(
    @Req() req: Request,
    @Body() body: GoogleAuthRequest,
  ): Promise<AuthResponse> {
    const token = await this.googleAuthService.getToken(body.code);
    const ticket = await (
      await this.googleAuthService.verifyToken(token.tokens.id_token)
    ).getPayload();
    await this.userService.findCreateOrUpdateGooleUser(ticket, token);
    return await this.authService.authenticateByOAuth(ticket.email, req.ip);
  }

  @Post('/refreshToken')
  @ResponseSchema(AuthResponse)
  async refreshToken(
    @Req() req: Request,
    @Body() auth: RefreshTokenRequest,
  ): Promise<AuthResponse> {
    return await this.authService.refreshToken(auth, req.ip);
  }

  @Get('/revokeToken/:id')
  async revokeTokenByUserId(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<boolean> {
    return await this.authService.revokeByUserId(id, req.ip);
  }
}
