import {
  Post,
  JsonController,
  CurrentUser,
  Get,
  Authorized,
  Param,
  Body,
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { Session } from '@business/auth/model';
import { inject, injectable } from 'inversify';
import { PermissionDto } from '../model';
import { Roles } from '@core/enums/role.enum';
import { IPermissionService } from '@business/core/interface';
import { SERVICE_TYPES } from '@infrastructures/modules';
import {
  BaseController,
  ResponseResult,
  RoutingAPI,
} from '@business/core/controller/baseController';

@injectable()
@JsonController(RoutingAPI.Permission)
@Authorized([Roles.Admin])
export class PermissionController extends BaseController {
  constructor(
    @inject(SERVICE_TYPES.PermissionService)
    private permissionService: IPermissionService,
  ) {
    super();
  }

  @Get()
  @ResponseSchema(PermissionDto, { isArray: true })
  async findAll(): Promise<ResponseResult<PermissionDto[]>> {
    const data = await this.permissionService.findAll();
    return this.Ok(true, data);
  }

  @Post('/:id')
  @ResponseSchema(PermissionDto)
  async update(
    @Param('id') id: string,
    @Body() body: PermissionDto,
    @CurrentUser() session: Session,
  ): Promise<ResponseResult<boolean>> {
    const errorCode = 0;
    const result = await this.permissionService.update(
      id,
      body,
      session,
      () => errorCode,
    );
    return this.Ok(result, null, errorCode);
  }
}
