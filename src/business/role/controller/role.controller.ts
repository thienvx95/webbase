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
import { inject, injectable } from 'inversify';
import RoleDto from '../model/role.dto';
import { SERVICE_TYPES } from '@infrastructures/modules';
import { RoleService } from '../service/role.service';
import {
  BaseController,
  RoutingAPI,
  ResponseResult,
  Session,
} from '@business/core/controller/baseController';
import { PaginateRequest } from '@business/common/model';
import { PaginationModel } from 'mongoose-paginate-ts';

@JsonController(RoutingAPI.Role)
@injectable()
@Authorized([Roles.Admin])
export class RoleController extends BaseController {
  constructor(
    @inject(SERVICE_TYPES.RoleService) private roleService: RoleService,
  ) {
    super();
  }

  @Authorized([Roles.Admin])
  @Post('/paging')
  @ResponseSchema(ResponseResult<PaginationModel<RoleDto>>)
  async findPaging(
    @Body() body: PaginateRequest,
  ): Promise<ResponseResult<PaginationModel<RoleDto>>> {
    const data = await this.roleService.findPaging(body);
    return this.Ok(true, data);
  }
  
  @Get()
  @ResponseSchema(RoleDto, { isArray: true })
  async find(): Promise<ResponseResult<RoleDto[]>> {
    const data = await this.roleService.findAll();
    return this.Ok(true, data);
  }

  @Get('/:id')
  @ResponseSchema(RoleDto)
  async findById(@Param('id') id: string): Promise<ResponseResult<RoleDto>> {
    const data = await this.roleService.findById(id);
    return this.Ok(true, data);
  }

  @Put()
  async create(
    @Body() body: RoleDto,
    @CurrentUser() session: Session,
  ): Promise<ResponseResult<boolean>> {
    let errorCode = 0;
    const result = await this.roleService.create(body, session, (error) => {
      errorCode = error;
    });
    return this.Ok(result, null, errorCode);
  }

  @Post('/:id')
  @ResponseSchema(RoleDto)
  async update(
    @Param('id') id: string,
    @Body() body: RoleDto,
    @CurrentUser() session: Session,
  ): Promise<ResponseResult<boolean>> {
    let errorCode = 0;
    const result = await this.roleService.update(id, body, session, (error) => {
      errorCode = error;
    });
    return this.Ok(result, null, errorCode);
  }

  @Delete('/:id')
  async delete(
    @Param('id') id: string,
    @CurrentUser() session: Session,
  ): Promise<ResponseResult<boolean>> {
    let errorCode = 0;
    const result = await this.roleService.delete(id, session, (error) => {
      errorCode = error;
    });
    return this.Ok(result, null, errorCode);
  }
}
