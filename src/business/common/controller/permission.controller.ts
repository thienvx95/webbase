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
import { RoutingAPI } from '@core/constants';

@injectable()
@JsonController(RoutingAPI.Permission)
@Authorized([Roles.Admin])
export class PermissionController {
  constructor(
    @inject(SERVICE_TYPES.PermissionService)
    private permissionService: IPermissionService,
  ) {}

  @Get()
  @ResponseSchema(PermissionDto, { isArray: true })
  async findAll(): Promise<PermissionDto[]> {
      return await this.permissionService.findAll();
  }

  @Post("/:id")
  @ResponseSchema(PermissionDto)
  async update(
      @Param("id") id: string,
      @Body() body: PermissionDto,
      @CurrentUser() session: Session
  ): Promise<boolean> {
      return await this.permissionService.update(id, body, session);
  }
}
