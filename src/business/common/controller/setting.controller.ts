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
import {
  SERVICE_TYPES,
} from '@infrastructures/modules/services';
import { SettingDto } from '../model';
import { Roles } from '@core/enums/role.enum';
import { ISettingService } from '../service/setting/setting.service';

@injectable()
@JsonController('/setting')
@Authorized([Roles.Admin])
export class SettingController {
  constructor(
    @inject(SERVICE_TYPES.SettingService)
    private settingService: ISettingService,
  ) {}

  @Get('/group')
  @ResponseSchema(SettingDto, { isArray: true })
  async findGroup(): Promise<SettingDto[]> {
    return await this.settingService.findGroup();
  }

  @Get('/group/:id')
  @ResponseSchema(SettingDto, { isArray: true })
  async findByGroup(@Param('id') id: string): Promise<SettingDto[]> {
    return await this.settingService.findByGroup(id);
  }

  @Post()
  async update(
    @Body() body: Array<SettingDto>,
    @CurrentUser() session: Session,
  ): Promise<boolean> {
    return await this.settingService.update(body, session);
  }
}
