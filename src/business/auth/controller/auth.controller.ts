import {
  Post,
  JsonController,
  Body,
  Req,
  Param,
  Authorized,
  CurrentUser,
  Get,
} from 'routing-controllers';
import { Request } from 'express';
import { ResponseSchema } from 'routing-controllers-openapi';
import {
  AuthRequest,
  AuthResponse,
  GoogleAuthRequest,
  RefreshTokenRequest,
  Session,
} from '@business/auth/model';
import { inject, injectable } from 'inversify';
import { COMMON_TYPES, SERVICE_TYPES } from '@infrastructures/modules';
import {
  IAuthService,
  IGoogleAuthService,
  ISiteSettings,
  IUserService,
} from '@business/core/interface';
import {
  BaseController,
  ResponseResult,
  RoutingAPI,
} from '@business/core/controller/baseController';
import { ErrorEnum } from '@core/enums/error.enum';
import { getUserSession } from '@core/ultis';
import { Roles } from '@core/enums/role.enum';
@injectable()
@JsonController(RoutingAPI.Auth)
export class AuthController extends BaseController {
  constructor(
    @inject(SERVICE_TYPES.AuthService) private authService: IAuthService,
    @inject(SERVICE_TYPES.GoogleAuthService)
    private googleAuthService: IGoogleAuthService,
    @inject(SERVICE_TYPES.UserService) private userService: IUserService,
    @inject(COMMON_TYPES.SiteSettings) private siteSettings: ISiteSettings,
  ) {
    super();
  }

  @Post()
  @ResponseSchema(ResponseResult<AuthResponse>)
  async authenticate(
    @Req() req: Request,
    @Body() auth: AuthRequest,
  ): Promise<ResponseResult<AuthResponse>> {
    const authen = await this.authService.authenticate(
      auth,
      getUserSession(req),
    );
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
      getUserSession(req),
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
    let errorCode = 0;
    const authen = await this.authService.refreshToken(
      auth,
      req.ip,
      (error) => {
        errorCode = error;
      },
    );
    if (authen) {
      return this.Ok<AuthResponse>(true, authen);
    }
    return this.Ok<AuthResponse>(false, null, errorCode);
  }

  @Authorized([Roles.Admin])
  @Post('/revokeToken/:id')
  async revokeTokenByUserId(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<boolean> {
    return await this.authService.revokeByUserId(id, req.ip);
  }

  @Authorized([Roles.Admin, Roles.User])
  @Post('/revokeCurrentUserToken')
  async revokeCurrentUserId(@CurrentUser() session: Session): Promise<boolean> {
    return await this.authService.revokeByUserId(session._id, session.ip);
  }

  @Get('/loginSetting')
  async getLoginSetting(): Promise<ResponseResult<string>> {
    return this.Ok<string>(true, this.siteSettings.get<string>('Google_Id'));
  }

  @Post('/google/callback')
  async googleCallBack(
    @Body() googleCallBack: any,
  ): Promise<ResponseResult<string>> {
    console.log(
      '🚀 ~ file: auth.controller.ts:133 ~ AuthController ~ googleCallBack ~ googleCallBack',
      googleCallBack,
    );
    return this.Ok<string>(true, null);
  }
}
