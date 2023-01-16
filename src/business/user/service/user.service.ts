import { HttpStatusError, HttpStatus, ErrorEnum } from '@core/exception/httpStatusError';
import { events } from '@business/core/events';
import { TokenPayload } from 'google-auth-library';
import { GetTokenResponse } from 'google-auth-library/build/src/auth/oauth2client';
import { gravatar, PasswordUtil } from '@core/ultis';
import { Logging } from '@core/log';
import { PaginateOptions, PaginateResult } from '@business/common/model';
import { User, UserToken } from 'entities';
import { ChangePasswordRequest, UserDto, UserTokenDto } from '@business/user/model';
import { inject, injectable } from 'inversify';
import { Session } from '@business/auth/model';
import { IAutoMapper, IEventDispatcher, IRepository, ISiteSettings, IUserService } from '@business/core/interface';
import { COMMON_TYPES, REPOSITORY_TYPES } from '@infrastructures/modules';

@injectable()
export class UserService implements IUserService {
  private readonly _log = Logging.getInstance('UserService');
  constructor(
    @inject(REPOSITORY_TYPES.UserRepository) private userRepository: IRepository<User>,
    @inject(REPOSITORY_TYPES.UserTokenRepository) private userTokenRepository: IRepository<UserToken>,
    @inject(COMMON_TYPES.SiteSettings) private siteSettings: ISiteSettings,
    @inject(COMMON_TYPES.EventDispatcher) private eventDispatcher: IEventDispatcher,
    @inject(COMMON_TYPES.AutoMapper) private autoMapper: IAutoMapper,
  ) {}

  async find(): Promise<UserDto[]> {
    this._log.info('Find all users');
    const models = await this.userRepository.find({});
    return this.autoMapper.MapArray(models, User, UserDto);
  }
  async findPaging(
    option: PaginateOptions,
  ): Promise<PaginateResult<UserDto>> {
    this._log.info('Find users paging');
    const models = await this.userRepository.findPaging(option);
    const result = new PaginateResult<UserDto>(models);
    result.results = this.autoMapper.MapArray(models.results, User, UserDto);
    return result;
  }

  async findById(id: string): Promise<UserDto> {
    this._log.info('Find one user id:' + id);
    const model = await this.userRepository.findById(id);
    return this.autoMapper.Map(model, User, UserDto);
  }

  async findByEmail(email: string): Promise<UserDto> {
    this._log.info('Find one user email:' + email);
    const model = await this.userRepository.findOne({ email: email });
    return this.autoMapper.Map(model, User, UserDto);
  }

  async findCreateOrUpdateGooleUser(
    ticket: TokenPayload,
    res: GetTokenResponse,
  ): Promise<void> {
    const existUser = await this.userRepository.findOne({
      email: ticket.email,
    });
    if (!existUser) {
      const passworDefault = this.siteSettings.get("Password_Default") as string;
      const user = {
        email: ticket.email,
        password: passworDefault,
        username: ticket.email,
        roles: ['Member'],
        firstName: ticket.given_name,
        lastName: ticket.family_name,
        avatar: ticket.picture,
        language: ticket.locale,
        services: {
          google: {
            sub: ticket.sub,
            access_token: res.tokens.access_token,
            refresh_token: res.tokens.refresh_token,
          },
        },
      } as UserDto
      await this.create(user,{
        _id: ticket.sub,
      });
    } else {
      const user = {
        firstName: ticket.family_name,
        lastName: ticket.given_name,
        avatar: ticket.picture,
        language: ticket.locale,
        services: {
          google: {
            sub: ticket.sub,
            access_token: res.tokens.access_token,
            refresh_token: res.tokens.refresh_token,
          },
        },
      } as UserDto
      await this.updateByEmail(ticket.email, user, { _id: ticket.sub });
    }
  }

  async create(dto: UserDto, session: Session): Promise<UserDto> {
    this._log.info('Create a new user');
    const user = new User({
      ...dto,
      avatar: gravatar(40, dto.email),
      createdBy: session._id,
    });

    const newUser = await this.userRepository.insertOne(user);
    this.eventDispatcher.dispatch(events.user.created, newUser);
    return this.autoMapper.Map(newUser, User, UserDto);
  }

  async update(_id: string, dto: UserDto, session: Session): Promise<boolean> {
    this._log.info('Update user id: ' + _id);
    const user = new User({
      ...dto,
      updatedBy: session._id,
    });
    const result = await this.userRepository.updateOne(_id, user);
    if (result) {
      this.eventDispatcher.dispatch(events.user.updated, dto);
    }
    return result;
  }

  async updateByEmail(email: string, dto: UserDto, session: Session): Promise<boolean> {
    this._log.info('Update user email: ' + email);
    const user = new User({
      ...dto,
      updatedBy: session._id,
    });
    const result = await this.userRepository.update({ email: email }, user);
    if (result) {
      this.eventDispatcher.dispatch(events.user.updated, user);
    }
    return result;
  }

  async delete(_id: string): Promise<boolean> {
    this._log.info('Delete a user');
    const result = await this.userRepository.deleteById(_id.toString());
    if (result) {
      this.eventDispatcher.dispatch(events.user.deleted, _id);
    }
    return result;
  }

  async changePassword(
    _id: string,
    req: ChangePasswordRequest,
  ): Promise<boolean> {
    this._log.info('Change password user id: ' + _id);
    const user = await this.userRepository.findById(_id);
    if (!user) {
      throw new HttpStatusError(HttpStatus.BadRequest, ErrorEnum.User_Not_Found);
    }

    const isMatch = await PasswordUtil.validatePassword({
      requestPassword: req.currentPassword,
      storedPassword: user.password,
    });
    if (!isMatch) {
      throw new HttpStatusError(HttpStatus.BadRequest, ErrorEnum.Password_Not_Match);
    }
    user.password = await PasswordUtil.encryptPassword(2, req.newPassword);
    user.save();
    this.eventDispatcher.dispatch(events.user.updated, {});
    return true;
  }
  async getTokenByUserId(userId: string): Promise<UserTokenDto[]> {
    const result = await this.userTokenRepository.find({ user: userId });
    return this.autoMapper.MapArray(result, UserToken, UserTokenDto);
  }
}
