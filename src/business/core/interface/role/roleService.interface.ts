import { Session } from '@business/auth/model';
import { PaginateRequest } from '@business/common/model';
import RoleDto from '@business/role/model/role.dto';
import { PaginationModel } from 'mongoose-paginate-ts';

export interface IRoleService {
  findPaging(
    paginateRequest: PaginateRequest,
  ): Promise<PaginationModel<RoleDto>>;
  findAll(): Promise<RoleDto[]>;
  findById(id: string): Promise<RoleDto>;
  create(
    role: RoleDto,
    session: Session,
    out: (errorCode: number) => void,
  ): Promise<boolean>;
  update(
    _id: string,
    role: RoleDto,
    session: Session,
    out: (errorCode: number) => void,
  ): Promise<boolean>;
  delete(
    _id: string,
    session: Session,
    out: (errorCode: number) => void,
  ): Promise<boolean>;
}
