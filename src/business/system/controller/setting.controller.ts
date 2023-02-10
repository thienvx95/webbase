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
import { SettingDto } from '../../common/model';
import { Roles } from '@core/enums/role.enum';
import { ISettingService, ISiteSettingPage } from '@business/core/interface';
import { COMMON_TYPES, SERVICE_TYPES } from '@infrastructures/modules';
import {
  BaseController,
  RoutingAPI,
  ResponseResult,
  Session,
} from '@business/core/controller/baseController';
import { BaseSettingPage } from '../model/setting/base.setting';
import { PageSettingEnum } from '@core/enums/settingPage.enum';

@injectable()
@JsonController(RoutingAPI.Setting)
export class SettingController extends BaseController {
  constructor(
    @inject(SERVICE_TYPES.SettingService)
    private settingService: ISettingService,
    @inject(COMMON_TYPES.SiteSettingPage)
    private siteSettingPage: ISiteSettingPage,
  ) {
    super();
  }

  @Authorized([Roles.Admin])
  @Get('/group')
  @ResponseSchema(SettingDto, { isArray: true })
  async findGroup(): Promise<ResponseResult<SettingDto[]>> {
    const data = await this.settingService.findGroup();
    return this.Ok(true, data);
  }

  @Authorized([Roles.Admin])
  @Get('/group/:id')
  @ResponseSchema(SettingDto, { isArray: true })
  async findByGroup(
    @Param('id') id: string,
  ): Promise<ResponseResult<SettingDto[]>> {
    const data = await this.settingService.findByGroup(id);
    return this.Ok(true, data);
  }

  @Authorized([Roles.Admin])
  @Post()
  async update(
    @Body() body: Array<SettingDto>,
    @CurrentUser() session: Session,
  ): Promise<ResponseResult<boolean>> {
    let errorCode = 0;
    const result = await this.settingService.update(body, session, (error) => {
      errorCode = error;
    });
    return this.Ok(result, null, errorCode);
  }

  @Get('/getSettingPage/:page')
  @ResponseSchema(BaseSettingPage)
  async getPageSettings(
    @Param('page') page: string,
  ): Promise<ResponseResult<BaseSettingPage>> {
    const data = await this.siteSettingPage.getPageSettings(
      PageSettingEnum[page],
    );
    return this.Ok(true, data);
  }
}
