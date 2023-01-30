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
import { inject, injectable } from 'inversify';
import { SettingDto } from '../model';
import { Roles } from '@core/enums/role.enum';
import { ISettingService } from '@business/core/interface';
import { SERVICE_TYPES } from '@infrastructures/modules';
import {
  BaseController,
  RoutingAPI,
  ResponseResult,
  Session,
} from '@business/core/controller/baseController';

@injectable()
@JsonController(RoutingAPI.Setting)
@Authorized([Roles.Admin])
export class SettingController extends BaseController {
  constructor(
    @inject(SERVICE_TYPES.SettingService)
    private settingService: ISettingService,
  ) {
    super();
  }

  @Get('/group')
  @ResponseSchema(SettingDto, { isArray: true })
  async findGroup(): Promise<ResponseResult<SettingDto[]>> {
    const data = await this.settingService.findGroup();
    return this.Ok(true, data);
  }

  @Get('/group/:id')
  @ResponseSchema(SettingDto, { isArray: true })
  async findByGroup(
    @Param('id') id: string,
  ): Promise<ResponseResult<SettingDto[]>> {
    const data = await this.settingService.findByGroup(id);
    return this.Ok(true, data);
  }

  @Post()
  async update(
    @Body() body: Array<SettingDto>,
    @CurrentUser() session: Session,
  ): Promise<ResponseResult<boolean>> {
    const errorCode = 0;
    const result = await this.settingService.update(
      body,
      session,
      () => errorCode,
    );
    return this.Ok(result, null, errorCode);
  }
}
