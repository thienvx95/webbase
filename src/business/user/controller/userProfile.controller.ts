import {
  Authorized,
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  CurrentUser,
  UploadedFile,
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { Roles } from '@core/enums/role.enum';
import {
  ChangePasswordRequest,
  UpdateProfileRequest,
  UserDto,
  UserLoginDto,
} from '../model';
import { Session } from '@business/auth/model';
import { PaginationModel } from 'mongoose-paginate-ts';
import { inject, injectable } from 'inversify';
import { CacheKey } from '@core/enums/cacheKey.enum';
import { ErrorEnum } from '@core/exception/httpStatusError';
import {
  IAuthService,
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
import { PaginateRequest } from '@business/common/model/pagingation/paginateRequest';

@JsonController(RoutingAPI.UserProfile)
@injectable()
export class UserProfileController extends BaseController {
  constructor(
    @inject(SERVICE_TYPES.UserService) private userService: IUserService,
    @inject(SERVICE_TYPES.AuthService) private authService: IAuthService,
    @inject(COMMON_TYPES.MemoryCache) private memoryCache: ICacheBase,
    @inject(SERVICE_TYPES.FileUploader) private fileUploader: IFileUploader,
  ) {
    super();
  }

  @Authorized([Roles.User, Roles.Admin])
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

  @Authorized([Roles.User, Roles.Admin])
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
      console.log(
        '🚀 ~ file: userProfile.controller.ts:81 ~ UserProfileController ~ uploadFiles:',
        uploadFiles,
      );
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

  @Authorized([Roles.User, Roles.Admin])
  @Post('/changeProfile')
  async changeProfile(
    @Body() body: UpdateProfileRequest,
    @CurrentUser() session: Session,
  ): Promise<ResponseResult<string>> {
    let errorCode = 0;
    const result = await this.userService.update(
      session._id,
      body,
      session,
      (error) => {
        errorCode = error;
      },
    );
    if (result) {
      this.memoryCache.removeAsync(
        this.getCacheKey(CacheKey.GetCurrentUser, session._id),
      );
    }
    return this.Ok(result, null, errorCode);
  }

  @Authorized([Roles.User, Roles.Admin])
  @Post('/changePassword')
  async ChangePassword(
    @Body() body: ChangePasswordRequest,
    @CurrentUser() session: Session,
  ): Promise<ResponseResult<boolean>> {
    let errorCode = 0;
    const result = await this.userService.changePassword(
      session._id,
      body,
      (error) => {
        errorCode = error;
      },
    );
    return this.Ok(result, null, errorCode);
  }

  @Authorized([Roles.User, Roles.Admin])
  @Post('/currentUserLoginActivities')
  async getCurrentUserLoginActivities(
    @Body() paginateRequest: PaginateRequest,
    @CurrentUser() session: Session,
  ): Promise<ResponseResult<PaginationModel<UserLoginDto>>> {
    paginateRequest.filter = { userId: [session._id] };
    const data = await this.userService.getUserLogin(paginateRequest);
    return this.Ok(true, data);
  }

  @Authorized([Roles.Admin, Roles.User])
  @Delete('/userLoginActivity/:id')
  async deleteUserLoginActivity(
    @Param('id') id: string,
    @CurrentUser() session: Session,
  ): Promise<ResponseResult<PaginationModel<UserLoginDto>>> {
    let errorCode = 0;
    const result = await this.userService.deleteUserLoginActivity(
      id,
      session,
      (error) => {
        errorCode = error;
      },
    );
    return this.Ok(result, null, errorCode);
  }

  @Authorized([Roles.Admin, Roles.User])
  @Delete('/userLoginActivity')
  async deleteAllUserLoginActivity(
    @CurrentUser() session: Session,
  ): Promise<ResponseResult<boolean>> {
    let errorCode = 0;
    const result = await this.userService.deleteAllUserLoginActivity(
      session,
      (error) => {
        errorCode = error;
      },
    );
    return this.Ok(result, null, errorCode);
  }

  @Authorized([Roles.Admin, Roles.User])
  @Post('/logoutAllLocations')
  async logoutAllLocations(
    @CurrentUser() session: Session,
  ): Promise<ResponseResult<boolean>> {
    const result = await this.authService.revokeByUserId(
      session._id,
      session.ip,
    );
    return this.Ok(result, null);
  }
}
