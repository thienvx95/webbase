import { Session } from "@business/auth/model";
import { PermissionDto } from "@business/common/model";

export interface IPermissionService {
    findAll(): Promise<PermissionDto[]>;
    findById(id: string): Promise<PermissionDto>;
    update(
      _id: string,
      permission: PermissionDto,
      session: Session,
    ): Promise<boolean>;
  }