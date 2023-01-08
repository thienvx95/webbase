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
import { Session } from '@business/auth/model';
import { inject, injectable } from 'inversify';
import { SERVICE_TYPES } from '@infrastructures/modules/services';
import { RoleService } from '../service/role.service';
import RoleDto from '../model/role.dto';

@JsonController('/role')
@injectable()
@Authorized([Roles.Admin])
export class RoleController {
  constructor(
    @inject(SERVICE_TYPES.RoleService) private roleService: RoleService,
  ) {}

  @Get()
  @ResponseSchema(RoleDto, { isArray: true })
  async find(): Promise<RoleDto[]> {
    return await this.roleService.findAll();
  }


  @Get('/:id')
  @ResponseSchema(RoleDto)
  async findById(@Param('id') id: string): Promise<RoleDto> {
    return await this.roleService.findById(id);
  }

  @Put()
  async create(
    @Body() body: RoleDto,
    @CurrentUser() session: Session,
  ): Promise<boolean> {
    return await this.roleService.create(body, session);
  }

  @Post('/:id')
  @ResponseSchema(RoleDto)
  async update(
    @Param('id') id: string,
    @Body() body: RoleDto,
    @CurrentUser() session: Session,
  ): Promise<boolean> {
    return await this.roleService.update(id, body, session);
  }

  @Delete('/:id')
  async delete(
    @Param('id') id: string,
    @CurrentUser() session: Session,
  ): Promise<boolean> {
    return await this.roleService.delete(id, session);
  }
}
