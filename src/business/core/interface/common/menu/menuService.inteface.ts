import { Session } from "@business/auth/model";
import { MenuDto } from "@business/common/model";
import { EditMenuDto } from "@business/common/model/menu/editMenu.dto";
import { TreeMenus } from "@business/common/model/menu/treeMenu.dto";

export interface IMenuService {
    getMenuCurrentUser(session: Session): Promise<MenuDto[]>;
    findById(id: string): Promise<MenuDto>; 
    update(_id: string, menu: EditMenuDto, session: Session, out: (errorCode: number) => number): Promise<boolean>;
    findAllTreeMenu(): Promise<TreeMenus[]>;
  }