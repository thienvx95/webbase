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
  UploadedFile,
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { Roles } from '@core/enums/role.enum';
import { ChangePasswordRequest, UpdateProfileRequest, UserDto } from '../model';
import { Session, UserTokenDto } from '@business/auth/model';
import { PaginateOptions, PaginateResult } from '@business/common/model';
import { inject, injectable } from 'inversify';
import { CacheKey } from '@core/enums/cacheKey.enum';
import { ErrorEnum } from '@core/exception/httpStatusError';
import {
  ICacheBase,
  IFileUploader,
  IUserService,
} from '@business/core/interface';
import { COMMON_TYPES, SERVICE_TYPES } from '@infrastructures/modules';
import { fileUploadOptions, resizeImage } from '@business/core/utils/';
import { isEmpty } from 'lodash';
import {
  BaseController,
  ResponseResult,
  RoutingAPI,
} from '@business/core/controller/baseController';
import { UploadType } from '@core/enums/uploadType.enum';

@JsonController(RoutingAPI.User)
@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(SERVICE_TYPES.UserService) private userService: IUserService,
    @inject(COMMON_TYPES.MemoryCache) private memoryCache: ICacheBase,
    @inject(SERVICE_TYPES.FileUploader) private fileUploader: IFileUploader,
  ) {
    super();
  }

  @Authorized([Roles.Admin])
  @Get('/detail/:id')
  @ResponseSchema(UserDto)
  async findById(@Param('id') id: string): Promise<ResponseResult<UserDto>> {
    const data = await this.userService.findById(id);
    return this.Ok(true, data);
  }

  @Authorized([Roles.Admin])
  @Get('/token/:id')
  @ResponseSchema(UserDto)
  async getToken(
    @Param('id') id: string,
  ): Promise<ResponseResult<UserTokenDto[]>> {
    const data = await this.userService.getTokenByUserId(id);
    return this.Ok(true, data);
  }

  @Authorized([Roles.User])
  @Get('/me')
  @ResponseSchema(UserDto)
  async findMe(
    @CurrentUser() session: Session,
  ): Promise<ResponseResult<UserDto>> {
    const data = await this.memoryCache.getAsync(
      this.getCacheKey(CacheKey.GetCurrentUser, session._id),
      () => this.userService.findById(session._id),
    );
    return this.Ok(true, data);
  }

  @Authorized([Roles.User])
  @Post('/uploadAvatar')
  async uploadAvatar(
    @UploadedFile('image', { options: fileUploadOptions() })
    file: Express.Multer.File,
    @CurrentUser() session: Session,
  ): Promise<ResponseResult<boolean>> {
    const resizeFile = await resizeImage(file, 144, 144);
    const uploadFiles = await this.fileUploader.upload(
      [resizeFile],
      UploadType.Avatar,
      session,
    );
    if (!isEmpty(uploadFiles)) {
      await this.fileUploader.deleteByTypeAndUserId(
        session._id,
        UploadType.Avatar,
        uploadFiles[0]._id,
      );
      const result = await this.userService.update(
        session._id,
        { avatar: uploadFiles[0].path },
        session,
        () => 0,
      );
      if (result) {
        this.memoryCache.removeAsync(
          this.getCacheKey(CacheKey.GetCurrentUser, session._id),
        );
        return this.Ok(true, null);
      }
    }
    return this.Ok(false, null, ErrorEnum.Not_Found);
  }

  @Authorized([Roles.Admin])
  @Post('/paging')
  @ResponseSchema(ResponseResult<PaginateResult<UserDto>>)
  async findPaging(
    @Body() body: PaginateOptions,
  ): Promise<ResponseResult<PaginateResult<UserDto>>> {
    const data = await this.userService.findPaging(body);
    return this.Ok(true, data);
  }

  @Authorized([Roles.User])
  @Put()
  @ResponseSchema(UserDto)
  async create(
    @Body() body: UserDto,
    @CurrentUser() session: Session,
  ): Promise<ResponseResult<boolean>> {
    const errorCode = 0;
    const result =
      (await this.userService.create(body, session, () => errorCode)) !== null;
    return this.Ok(result, null, errorCode);
  }

  @Authorized([Roles.Admin])
  @Post()
  @ResponseSchema(UserDto)
  async update(
    @Body() body: UserDto,
    @CurrentUser() session: Session,
  ): Promise<ResponseResult<boolean>> {
    const errorCode = 0;
    const result = await this.userService.update(
      body._id,
      body,
      session,
      () => errorCode,
    );
    return this.Ok(result, null, errorCode);
  }

  @Authorized([Roles.User])
  @Post('/changeProfile')
  async changeProfile(
    @Body() body: UpdateProfileRequest,
    @CurrentUser() session: Session,
  ): Promise<ResponseResult<string>> {
    const errorCode = 0;
    const result = await this.userService.update(
      session._id,
      body,
      session,
      () => errorCode,
    );
    if (result) {
      this.memoryCache.removeAsync(
        this.getCacheKey(CacheKey.GetCurrentUser, session._id),
      );
    }
    return this.Ok(result, null, errorCode);
  }

  @Authorized([Roles.User])
  @Post('/changePassword')
  async ChangePassword(
    @Body() body: ChangePasswordRequest,
    @CurrentUser() session: Session,
  ): Promise<ResponseResult<boolean>> {
    const errorCode = 0;
    const result = await this.userService.changePassword(
      session._id,
      body,
      () => errorCode,
    );
    return this.Ok(result, null, errorCode);
  }

  @Authorized([Roles.Admin])
  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<ResponseResult<boolean>> {
    const errorCode = 0;
    const result = await this.userService.delete(id, () => errorCode);
    return this.Ok(result, null, errorCode);
  }
}
