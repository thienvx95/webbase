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
  import {
    Session,
  } from '@business/auth/model';
  import { inject, injectable } from 'inversify';
  import { SERVICE_TYPES } from '@infrastructures/modules/services';
import { IMenuService } from '../service/menu/menu.service';
import { MenuDto } from '../model';
import { TreeMenus } from '../model/menu/treeMenu.dto';
import { Roles } from '@core/enums/role.enum';
import { EditMenuDto } from '../model/menu/editMenu.dto';
import { COMMON_TYPES } from '@infrastructures/modules/common';
import { ICacheBase } from '@infrastructures/caching/cacheBase.interface';
import { CacheKey } from '@core/enums/cacheKey.enum';
import { stringFormat } from '@core/ultis';
  
  @injectable()
  @JsonController('/menu')
  export class MenuController {
    constructor(
      @inject(SERVICE_TYPES.MenuService) private menuService: IMenuService,
      @inject(COMMON_TYPES.MemoryCache) private memoryCache: ICacheBase,
    ) {}
  
    @Get("/getTreeMenus")
    @Authorized([Roles.Admin])
    @ResponseSchema(TreeMenus, { isArray: true })
    async findAllTreeMenu(): Promise<TreeMenus[]> {
      return await this.menuService.findAllTreeMenu();
    }
    
    @Get('/getCurrentMenu')
    @Authorized([Roles.User, Roles.Admin])
    async getMenus(
      @CurrentUser() session: Session
    ): Promise<MenuDto[]> {
      return this.memoryCache.getAsync(stringFormat(CacheKey.GetCurrentMenu, session._id), () => this.menuService.getMenuCurrentUser(session));
    }

    @Get("/detail/:id")
    @Authorized([Roles.Admin])
    @ResponseSchema(MenuDto, { isArray: true })
    async findById(@Param("id") id: string): Promise<MenuDto> {
      return await this.menuService.findById(id);
    }
  
    @Post("/:id")
    @Authorized([Roles.Admin])
    async update(
      @Param("id") id: string,
      @Body() body: EditMenuDto,
      @CurrentUser() session: Session
    ): Promise<boolean> {
      return await this.menuService.update(id, body, session);
    }
  }
