import { Session } from "@business/auth/model";
import { MenuDto, EditMenuDto, TreeMenus } from "@business/common/model";

export interface IMenuService {
    getMenuCurrentUser(session: Session): Promise<MenuDto[]>;
    findById(id: string): Promise<MenuDto>; 
    update(_id: string, menu: EditMenuDto, session: Session): Promise<boolean>;
    findAllTreeMenu(): Promise<TreeMenus[]>;
  }