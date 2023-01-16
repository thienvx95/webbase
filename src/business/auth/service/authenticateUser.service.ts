import {
  HttpStatusError,
  HttpStatus,
  ErrorEnum,
} from '@core/exception/httpStatusError';
import { Logging } from '@core/log';
import { SystemConfig } from '@core/configuration';
import { User, UserToken } from '@entities/index';
import {
  AuthRequest,
  AuthResponse,
  JwtPayload,
  RefreshTokenRequest,
} from '../model';
import { PasswordUtil, TokenUtil } from '@core/ultis';
import { UserDto } from '@business/user/model';
import { injectable, inject } from 'inversify';
import { IAuthService, IAutoMapper, IRepository } from '@business/core/interface';
import { REPOSITORY_TYPES, COMMON_TYPES } from '@infrastructures/modules';

@injectable()
export class AuthenticateUserService implements IAuthService {
  private log = Logging.getInstance('AuthenticateUserService');
  private configs = SystemConfig.Configs;

  constructor(
    @inject(REPOSITORY_TYPES.UserRepository) private userRepository: IRepository<User>,
    @inject(REPOSITORY_TYPES.UserTokenRepository) private userTokenRepository: IRepository<UserToken>,
    @inject(COMMON_TYPES.AutoMapper) private autoMapper: IAutoMapper,
  ) {}

  authenticate = async (
    { username, password }: AuthRequest,
    ipAddress: string,
  ): Promise<AuthResponse> => {
    this.log.info('Login user: ' + username);
    const user = await this.userRepository.findOne({ username });
    if (!user) {
      throw new HttpStatusError(HttpStatus.Ok, ErrorEnum.Login_Invalid);
    }
    
    if (!user.isActive) {
      throw new HttpStatusError(HttpStatus.Ok, ErrorEnum.Login_Invalid);
    }
    
    const isMatch = await PasswordUtil.validatePassword({
      requestPassword: password,
      storedPassword: user.password,
    });

    if (!isMatch) {
      throw new HttpStatusError(
        HttpStatus.Ok,
        ErrorEnum.Password_Not_Match,
      );
    }
    const token = await TokenUtil.generateToken(
      new JwtPayload(this.autoMapper.Map(user, User, UserDto)),
    );
    user.lastLogin = new Date();
    user.save();
    const refreshToken = await this.generateRefreshToken(user._id, ipAddress);
    return {
      token,
      refreshToken: refreshToken.token,
    };
  };

  authenticateByOAuth = async (
    email: string,
    ipAddress: string,
  ): Promise<AuthResponse> => {
    this.log.info('Login user: ' + email);
    const user = await this.userRepository.findOne({ email: email });
    if (!user) {
      throw new HttpStatusError(HttpStatus.BadRequest, ErrorEnum.Login_Invalid);
    }

    if (!user.isActive) {
      throw new HttpStatusError(HttpStatus.BadRequest, ErrorEnum.Login_Invalid);
    }
    const token = await TokenUtil.generateToken(
      new JwtPayload(this.autoMapper.Map(user, User, UserDto)),
    );
    const refreshToken = await this.generateRefreshToken(user._id, ipAddress);
    return {
      token,
      refreshToken: refreshToken.token,
    };
  };

  revokeByToken = async (
    { token }: RefreshTokenRequest,
    ipAddress: string,
  ): Promise<boolean> =>
    this.userTokenRepository.update(
      { token },
      {
        revoked: new Date(),
        revokedByIp: ipAddress,
      },
    );

  revokeByUserId = async (id: string, ipAddress: string): Promise<boolean> =>
    this.userTokenRepository.update(
      { user: id },
      {
        revoked: new Date(),
        revokedByIp: ipAddress,
      },
    );

  refreshToken = async (
    { token }: RefreshTokenRequest,
    ipAddress: string,
  ): Promise<AuthResponse> => {
    this.log.info('Refresh Token Ip:' + ipAddress);
    const refreshToken = await this.getRefreshToken(token);
    const { _id, user } = refreshToken;

    const existUser = await this.userRepository.findOne({ _id: user });
    if (!existUser) {
      throw new HttpStatusError(
        HttpStatus.Ok,
        ErrorEnum.User_Not_Found,
      );
    }

    if (!existUser.isActive) {
      throw new HttpStatusError(
        HttpStatus.Ok,
        ErrorEnum.Login_Inactive,
      );
    }

    const newGenerateToken = TokenUtil.randomTokenString();
    const result = await this.userTokenRepository.update(
      { _id },
      { token: newGenerateToken, replacedByToken: refreshToken.token },
    );
    if (!result) {
      throw new HttpStatusError(HttpStatus.Ok, ErrorEnum.Invalid_Token);
    }
    const newToken = await TokenUtil.generateToken(
      new JwtPayload(this.autoMapper.Map(existUser, User, UserDto)),
    );
    return {
      token: newToken,
      refreshToken: newGenerateToken,
    };
  };

  private getRefreshToken = async (token: string) : Promise<UserToken> => {
    const refreshTokens = await this.userTokenRepository.findOne({ token });
    if (!refreshTokens) {
      throw new HttpStatusError(HttpStatus.Ok, ErrorEnum.Invalid_Token);
    }

    if (!refreshTokens.isActive()) {
        throw new HttpStatusError(HttpStatus.Ok, ErrorEnum.Invalid_Token);
    }

    return refreshTokens;
  };

  private generateRefreshToken = async (
    userId: string,
    ip: string,
  ): Promise<UserToken> => {
    const existToken = await this.userTokenRepository.findOne({
        user: userId,
        createdByIp: ip,
      })
      if (existToken) {
        if (existToken.isActive()) {
          return existToken;
        } else {
          await this.userTokenRepository.deleteById(existToken._id.toString());
        }
      }
      const newRefreshToken = await this.userTokenRepository.insertOne(
        new UserToken({
          user: userId,
          token: TokenUtil.randomTokenString(),
          expires: new Date(
            Date.now() +
              this.configs.AppSetting.refreshTokenExpriesIn * 8640 * 1000,
          ),
          createdByIp: ip,
        }),
      );
  
      return newRefreshToken;
  };
}
