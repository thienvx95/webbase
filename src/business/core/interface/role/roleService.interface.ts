import { Session } from "@business/auth/model";
import RoleDto from "@business/role/model/role.dto";

export interface IRoleService {
    findAll(): Promise<RoleDto[]>;
    findById(id: string): Promise<RoleDto>;
    create(role: RoleDto, session: Session): Promise<boolean>;
    update(_id: string, role: RoleDto, session: Session): Promise<boolean>;
    delete(_id: string, session: Session): Promise<boolean>;
  }