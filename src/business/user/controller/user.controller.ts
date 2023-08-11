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
import { Roles } from '@core/enums/role.enum';
import { UserDto } from '../model';
import { Session, UserTokenDto } from '@business/auth/model';
import { PaginationModel } from 'mongoose-paginate-ts';
import { inject, injectable } from 'inversify';
import { IUserService } from '@business/core/interface';
import { SERVICE_TYPES } from '@infrastructures/modules';
import {
  BaseController,
  ResponseResult,
  RoutingAPI,
} from '@business/core/controller/baseController';
import { PaginateRequest } from '@business/common/model/pagingation/paginateRequest';

@JsonController(RoutingAPI.User)
@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(SERVICE_TYPES.UserService) private userService: IUserService,
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

  @Authorized([Roles.Admin])
  @Post('/paging')
  @ResponseSchema(ResponseResult<PaginationModel<UserDto>>)
  async findPaging(
    @Body() body: PaginateRequest,
  ): Promise<ResponseResult<PaginationModel<UserDto>>> {
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
    let errorCode = 0;
    const result =
      (await this.userService.create(body, session, (error) => {
        errorCode = error;
      })) !== null;
    return this.Ok(result, null, errorCode);
  }

  @Authorized([Roles.Admin])
  @Post()
  @ResponseSchema(UserDto)
  async update(
    @Body() body: UserDto,
    @CurrentUser() session: Session,
  ): Promise<ResponseResult<boolean>> {
    let errorCode = 0;
    const result = await this.userService.update(
      body._id,
      body,
      session,
      (error) => {
        errorCode = error;
      },
    );
    return this.Ok(result, null, errorCode);
  }

  @Authorized([Roles.Admin])
  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<ResponseResult<boolean>> {
    let errorCode = 0;
    const result = await this.userService.delete(id, (error) => {
      errorCode = error;
    });
    return this.Ok(result, null, errorCode);
  }
}
