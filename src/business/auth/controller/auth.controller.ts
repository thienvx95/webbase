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
import {
  IAuthService,
  IGoogleAuthService,
  IUserService,
} from '@business/core/interface';
import {
  BaseController,
  ResponseResult,
  RoutingAPI,
} from '@business/core/controller/baseController';
import { ErrorEnum } from '@core/enums/error.enum';

@injectable()
@JsonController(RoutingAPI.Auth)
export class AuthController extends BaseController {
  constructor(
    @inject(SERVICE_TYPES.AuthService) private authService: IAuthService,
    @inject(SERVICE_TYPES.GoogleAuthService)
    private googleAuthService: IGoogleAuthService,
    @inject(SERVICE_TYPES.UserService) private userService: IUserService,
  ) {
    super();
  }

  @Post()
  @ResponseSchema(ResponseResult<AuthResponse>)
  async authenticate(
    @Req() req: Request,
    @Body() auth: AuthRequest,
  ): Promise<ResponseResult<AuthResponse>> {
    const authen = await this.authService.authenticate(auth, req.ip);
    if (authen) {
      return this.Ok<AuthResponse>(true, authen);
    }
    return this.Ok<AuthResponse>(false, null, ErrorEnum.Login_Invalid);
  }

  @Post('/google')
  @ResponseSchema(AuthResponse)
  async google(
    @Req() req: Request,
    @Body() body: GoogleAuthRequest,
  ): Promise<ResponseResult<AuthResponse>> {
    const token = await this.googleAuthService.getToken(body.code);
    const ticket = await (
      await this.googleAuthService.verifyToken(token.tokens.id_token)
    ).getPayload();
    await this.userService.findCreateOrUpdateGooleUser(ticket, token);
    const authen = await this.authService.authenticateByOAuth(
      ticket.email,
      req.ip,
    );
    if (authen) {
      return this.Ok<AuthResponse>(true, authen);
    }
    return this.Ok<AuthResponse>(false, null, ErrorEnum.Login_Invalid);
  }

  @Post('/refreshToken')
  @ResponseSchema(AuthResponse)
  async refreshToken(
    @Req() req: Request,
    @Body() auth: RefreshTokenRequest,
  ): Promise<ResponseResult<AuthResponse>> {
    const errorCode = 0;
    const authen = await this.authService.refreshToken(
      auth,
      req.ip,
      () => errorCode,
    );
    if (authen) {
      return this.Ok<AuthResponse>(true, authen);
    }
    return this.Ok<AuthResponse>(false, null, errorCode);
  }

  @Get('/revokeToken/:id')
  async revokeTokenByUserId(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<boolean> {
    return await this.authService.revokeByUserId(id, req.ip);
  }
}
