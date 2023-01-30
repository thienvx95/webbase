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
import { MenuDto } from '../model';
import { TreeMenus } from '../model/menu/treeMenu.dto';
import { Roles } from '@core/enums/role.enum';
import { EditMenuDto } from '../model/menu/editMenu.dto';
import { CacheKey } from '@core/enums/cacheKey.enum';
import { SERVICE_TYPES, COMMON_TYPES } from '@infrastructures/modules';
import { IMenuService, ICacheBase } from '@business/core/interface';
import {
  BaseController,
  ResponseResult,
  RoutingAPI,
} from '@business/core/controller/baseController';
@injectable()
@JsonController(RoutingAPI.Menu)
export class MenuController extends BaseController {
  constructor(
    @inject(SERVICE_TYPES.MenuService) private menuService: IMenuService,
    @inject(COMMON_TYPES.MemoryCache) private memoryCache: ICacheBase,
  ) {
    super();
  }

  @Get('/getTreeMenus')
  @Authorized([Roles.Admin])
  @ResponseSchema(TreeMenus, { isArray: true })
  async findAllTreeMenu(): Promise<ResponseResult<TreeMenus[]>> {
    const data = await this.menuService.findAllTreeMenu();
    return this.Ok(true, data);
  }

  @Get('/getCurrentMenu')
  @Authorized([Roles.User, Roles.Admin])
  async getMenus(
    @CurrentUser() session: Session,
  ): Promise<ResponseResult<MenuDto[]>> {
    const data = await this.memoryCache.getAsync(
      this.getCacheKey(CacheKey.GetCurrentMenu, session._id),
      () => this.menuService.getMenuCurrentUser(session),
    );
    return this.Ok(true, data);
  }

  @Get('/detail/:id')
  @Authorized([Roles.Admin])
  @ResponseSchema(MenuDto, { isArray: true })
  async findById(@Param('id') id: string): Promise<ResponseResult<MenuDto>> {
    const data = await this.menuService.findById(id);
    return this.Ok(true, data);
  }

  @Post('/:id')
  @Authorized([Roles.Admin])
  async update(
    @Param('id') id: string,
    @Body() body: EditMenuDto,
    @CurrentUser() session: Session,
  ): Promise<ResponseResult<boolean>> {
    const errorCode = 0;
    const result = await this.menuService.update(
      id,
      body,
      session,
      () => errorCode,
    );
    return this.Ok(result, null, errorCode);
  }
}
