import {
  Authorized,
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  CurrentUser,
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { UserService } from '@business/user/service/user.service';
import { Roles } from '@core/enums/role.enum';
import { ChangePasswordRequest, UpdateProfileRequest, UserDto } from '../model';
import { User } from '@entities/index';
import { Session, UserTokenDto } from '@business/auth/model';
import {
  PaginateOptions,
  PaginateResult,
} from '@business/common/model';
import { inject, injectable } from 'inversify';
import { SERVICE_TYPES, COMMON_TYPES } from '@infrastructures/modules';
import { ICacheBase } from '@infrastructures/caching/cacheBase.interface';
import { stringFormat } from '@core/ultis';
import { CacheKey } from '@core/enums/cacheKey.enum';
import { ErrorEnum, HttpStatus, HttpStatusError } from '@core/exception/httpStatusError';

@JsonController('/user')
@injectable()
export class UserController {
  constructor(
    @inject(SERVICE_TYPES.UserService) private userService: UserService,
    @inject(COMMON_TYPES.MemoryCache) private memoryCache: ICacheBase,
  ) {}

  @Authorized([Roles.Admin])
  @Get('/detail/:id')
  @ResponseSchema(UserDto)
  async findById(@Param('id') id: string): Promise<UserDto> {
    return await this.userService.findById(id);
  }

  @Authorized([Roles.Admin])
  @Get('/token/:id')
  @ResponseSchema(UserDto)
  async getToken(@Param('id') id: string): Promise<UserTokenDto[]> {
    return await this.userService.getTokenByUserId(id);
  }

  @Authorized([Roles.User])
  @Get('/me')
  @ResponseSchema(UserDto)
  async findMe(@CurrentUser() session: Session): Promise<UserDto> {
    return this.memoryCache.getAsync(stringFormat(CacheKey.GetCurrentUser, session._id), () => this.userService.findById(session._id));
  }

  // @Authorized([Roles.User])
  // @Get('/uploadAvatar')
  // @ResponseSchema(UserDto)
  // async uploadAvatar(
  //   @UploadedFile('file') file: Express.Multer.File,
  // ): Promise<FileUploadDto[]> {
  //   return await this.fileUploader.upload([file]);
  // }

  @Authorized([Roles.Admin])
  @Post('/paging')
  @ResponseSchema(PaginateResult<UserDto>)
  async findPaging(
    @Body() body: PaginateOptions,
  ): Promise<PaginateResult<UserDto>> {
    return await this.userService.findPaging(body);
  }

  @Authorized([Roles.User])
  @Put()
  @ResponseSchema(UserDto)
  async create(
    @Body() body: UserDto,
    @CurrentUser() session: Session,
  ): Promise<boolean> {
    const user = new User({
      ...body,
      createdBy: session._id,
    });
    return (await this.userService.create(user)) !== null;
  }

  @Authorized([Roles.Admin])
  @Post()
  @ResponseSchema(UserDto)
  async update(
    @Body() body: UserDto,
    @CurrentUser() session: Session,
  ): Promise<boolean> {
    const user = new User({
      ...body,
      createdBy: session._id,
    });
    return await this.userService.update(body._id, user);
  }

  @Authorized([Roles.User])
  @Post('/changeProfile')
  async changeProfile(
    @Body() body: UpdateProfileRequest,
    @CurrentUser() session: Session,
  ): Promise<string> {
    const user = new User({
      ...body,
      updatedBy: session._id,
    });
    const result = await this.userService.update(session._id, user);
    if(result){
      this.memoryCache.removeAsync(stringFormat(CacheKey.GetCurrentUser, session._id));
      return '';
    }
    throw new HttpStatusError(HttpStatus.Ok, ErrorEnum.Error_Update);
  }

  @Authorized([Roles.User])
  @Post('/changePassword')
  async ChangePassword(
    @Body() body: ChangePasswordRequest,
    @CurrentUser() session: Session,
  ): Promise<boolean> {
    return await this.userService.changePassword(session._id, body);
  }

  @Authorized([Roles.Admin])
  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return await this.userService.delete(id);
  }
}
