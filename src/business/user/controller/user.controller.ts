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
import { Service } from 'typedi';
import { ResponseSchema } from '@routing-controllers-openapi';
import { UserService } from '@business/user/service/user.service';
import { Roles } from '@core/enums/role.enum';
import {
  FileUploader,
  IFileUploader,
} from '@infrastructures/decorators/fileUploader.decorator';
import { ChangePasswordRequest, UserDto } from '../model';
import { User } from '@entities/index';
import { Session, UserTokenDto } from '@business/auth/model';
import {
  FileUploadDto,
  PaginateOptions,
  PaginateResult,
} from '@business/common/model';

@JsonController('/users')
@Service()
export class UserController {
  constructor(
    private userService: UserService,
    @FileUploader() private fileUploader: IFileUploader,
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
    return await this.userService.findById(session._id);
  }

  @Authorized([Roles.User])
  @Get('/uploadAvatar')
  @ResponseSchema(UserDto)
  async uploadAvatar(
    @UploadedFile('file') file: Express.Multer.File,
  ): Promise<FileUploadDto[]> {
    return await this.fileUploader.upload([file]);
  }

  @Authorized([Roles.Admin])
  @Post('/paging')
  @ResponseSchema(PaginateResult < UserDto)
  async findPaging(
    @Body() body: PaginateOptions,
  ): Promise<PaginateResult<UserDto>> {
    return await this.userService.findPaging(body);
  }

  @Authorized([Roles.User])
  @Post()
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
  @Put()
  @ResponseSchema(UserDto)
  async update(
    @Body() body: UserDto,
    @CurrentUser() session: Session,
  ): Promise<boolean> {
    const user = new User({
      ...body,
      createdBy: session._id,
    });
    return await this.userService.update(body.id, user);
  }

  @Authorized([Roles.User])
  @Put('/changeProfile')
  async changeProfile(
    @Body() body: UserDto,
    @CurrentUser() session: Session,
  ): Promise<boolean> {
    const user = new User({
      ...body,
      createdBy: session._id,
    });
    return await this.userService.update(session._id, user);
  }

  @Authorized([Roles.User])
  @Put('/changePassword')
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
