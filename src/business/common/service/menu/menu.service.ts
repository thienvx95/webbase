import { Logging } from '@core/log';
import { MenuDto } from '@business/common/model';
import { Menu } from 'entities';
import { inject, injectable } from 'inversify';
import { Session } from '@business/auth/model';
import { isEmpty } from 'lodash';
import { EditMenuDto, TreeMenus } from '@business/common/model';
import { events } from '@business/core/events';
import { COMMON_TYPES, REPOSITORY_TYPES } from '@infrastructures/modules';
import {
  IAutoMapper,
  IEventDispatcher,
  IMenuService,
  IRepository,
} from '@business/core/interface';
import { ErrorEnum } from '@core/enums/error.enum';
@injectable()
export class MenuService implements IMenuService {
  private readonly _log = Logging.getInstance('MenuService');
  constructor(
    @inject(REPOSITORY_TYPES.MenuRepository)
    private menuRepository: IRepository<Menu>,
    @inject(COMMON_TYPES.AutoMapper) private autoMapper: IAutoMapper,
    @inject(COMMON_TYPES.EventDispatcher)
    private eventDispatcher: IEventDispatcher,
  ) {}
  async getMenuCurrentUser(session: Session): Promise<MenuDto[]> {
    this._log.info(`User Id ${session._id}`, 'GetMenuCurrentUser');
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
    this._log.info('Menu Id: ' + id, 'FindById');
    const model = await this.menuRepository.findById(id);
    return this.autoMapper.Map(model, Menu, MenuDto);
  }

  async update(
    _id: string,
    menu: EditMenuDto,
    session: Session,
    out: (errorCode: number) => void,
  ): Promise<boolean> {
    this._log.info(
      `Menu id: ${_id} - data: ${JSON.stringify(menu)} By ${session._id}`,
      'update',
    );
    const result = await this.menuRepository.update({ _id }, {});
    if (result) {
      this.eventDispatcher.dispatch(events.menu.updated, menu);
    } else {
      out(ErrorEnum.Error_Update);
    }
    return result;
  }

  private buildDateTree = (data: MenuDto[], isMenus = true): MenuDto[] => {
    const hashTable = Object.create(null);
    if (isMenus) {
      data.forEach((x) => (hashTable[x._id] = { ...x, children: [] }));
    } else {
      data.forEach(
        (x) => (hashTable[x._id] = { key: x._id, title: x.name, children: [] }),
      );
    }

    const dataTree: MenuDto[] = [];
    data.forEach((x) => {
      if (x.parentId) hashTable[x.parentId]?.children?.push(hashTable[x._id]);
      else dataTree.push(hashTable[x._id]);
    });
    return dataTree;
  };
}
