import { Logging } from '@core/log';
import { MenuDto } from '@business/common/model';
import { Menu } from 'entities';
import { inject, injectable } from 'inversify';
import {
  IRepository,
  REPOSITORY_TYPES,
} from '@infrastructures/modules/repositories';
import { COMMON_TYPES, IAutoMapper, IEventDispatcher } from '@infrastructures/modules/common';
import { Session } from '@business/auth/model';
import { isEmpty } from 'lodash';
import { EditMenuDto } from '@business/common/model/menu/editMenu.dto';
import { events } from '@infrastructures/events';
import { TreeMenus } from '@business/common/model/menu/treeMenu.dto';

export interface IMenuService {
  getMenuCurrentUser(session: Session): Promise<MenuDto[]>;
  findById(id: string): Promise<MenuDto>; 
  update(_id: string, menu: EditMenuDto, session: Session): Promise<boolean>;
  findAllTreeMenu(): Promise<TreeMenus[]>;
}

@injectable()
export class MenuService implements IMenuService {
  private readonly _log = Logging.getInstance('MenuService');
  constructor(
    @inject(REPOSITORY_TYPES.MenuRepository) private menuRepository: IRepository<Menu>,
    @inject(COMMON_TYPES.AutoMapper) private autoMapper: IAutoMapper,
    @inject(COMMON_TYPES.EventDispatcher) private eventDispatcher: IEventDispatcher,
  ) {}
  async getMenuCurrentUser(session: Session): Promise<MenuDto[]> {
    this._log.info(`User Id ${session._id}`, 'GetMenuCurrentUser')
    const allMenus = await this.menuRepository.find({
      authority: { $in: session.roles },
      isActive: true,
    });
    if (!isEmpty(allMenus)) {
      const menuToDto = this.autoMapper.MapArray(allMenus, Menu, MenuDto);
      return this.buildDateTree(menuToDto);
    }
    return [];
  }

  async findAllTreeMenu(): Promise<TreeMenus[]> {
    this._log.info('', 'findAllTreeMenu');
      const models = await this.menuRepository.find({});
      if (!isEmpty(models)) {
        const menuToDto = this.autoMapper.MapArray(models, Menu, MenuDto);
          return this.buildDateTree(menuToDto, false);
      }
      return [];
  }

  async findById(id: string): Promise<MenuDto> {
    this._log.info("Menu Id: " + id, 'FindById');
    const model =  await this.menuRepository.findById(id);
    return this.autoMapper.Map(model, Menu, MenuDto);
  }

  async update(_id: string, menu: EditMenuDto, session: Session): Promise<boolean> {
    this._log.info(`Menu id: ${_id} - data: ${JSON.stringify(menu)} By ${session._id}` , 'update');
    const result = await this.menuRepository.update({ _id }, {
        
    });
    if(result){
      this.eventDispatcher.dispatch(events.menu.updated, menu);
    }

    return result;
  }

  private buildDateTree = (data: MenuDto[], isMenus = true): MenuDto[] => {
    const hashTable = Object.create(null);
    if (isMenus) {
      data.forEach((x) => (hashTable[x.id] = { ...x, children: [] }));
    } else {
      data.forEach(
        (x) => (hashTable[x.id] = { key: x.id, title: x.name, children: [] }),
      );
    }

    const dataTree: MenuDto[] = [];
    data.forEach((x) => {
      if (x.parentId) hashTable[x.parentId]?.children?.push(hashTable[x.id]);
      else dataTree.push(hashTable[x.id]);
    });
    return dataTree;
  };
}
