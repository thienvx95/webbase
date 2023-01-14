import { Logging } from '@core/log';
import { Role } from 'entities';
import { inject, injectable } from 'inversify';
import {
  IRepository,
  REPOSITORY_TYPES,
} from '@infrastructures/modules/repositories';
import {
  COMMON_TYPES,
  IAutoMapper,
  IEventDispatcher,
} from '@infrastructures/modules/common';
import { Session } from '@business/auth/model';
import { events } from '@infrastructures/events';
import RoleDto from '../model/role.dto';
import { Roles } from '@core/enums/role.enum';

export interface IRoleService {
  findAll(): Promise<RoleDto[]>;
  findById(id: string): Promise<RoleDto>;
  create(role: RoleDto, session: Session): Promise<boolean>;
  update(_id: string, role: RoleDto, session: Session): Promise<boolean>;
  delete(_id: string, session: Session): Promise<boolean>;
}

@injectable()
export class RoleService implements IRoleService {
  private readonly _log = Logging.getInstance('RoleService');
  constructor(
    @inject(REPOSITORY_TYPES.RoleRepository)
    private roleRepository: IRepository<Role>,
    @inject(COMMON_TYPES.AutoMapper) private autoMapper: IAutoMapper,
    @inject(COMMON_TYPES.EventDispatcher)
    private eventDispatcher: IEventDispatcher,
  ) {}
  async findAll(): Promise<RoleDto[]> {
    this._log.info('', 'FindAll');
    const models = await this.roleRepository.find({});
    return this.autoMapper.MapArray(models, Role, RoleDto);
  }

  async findById(id: string): Promise<RoleDto> {
    this._log.info('Role id: ' + id, 'FindById');
    const model = await this.roleRepository.findById(id);
    return this.autoMapper.Map(model, Role, RoleDto);
  }

  async create(role: RoleDto, session: Session): Promise<boolean> {
    this._log.info(
      `Role ${JSON.stringify(role)} - By ${session._id}`,
      'Create',
    );
    const newRole = await this.roleRepository.insertOne({
        _id: role._id,
        description: role.description,
        createdBy: session._id,
    });
    if (newRole) {
      this.eventDispatcher.dispatch(events.role.created, newRole);
      return true;
    }
    return false;
  }

  async update(_id: string, role: RoleDto, session: Session): Promise<boolean> {
    this._log.info(
      `Role id: ${_id} - Data: ${JSON.stringify(role)} - By ${session._id}`,
      'Update',
    );
    const result = await this.roleRepository.updateOne(
        _id,
      { description: role.description, updatedBy: session._id },
    );
    if (result) {
      this.eventDispatcher.dispatch(events.role.updated, role);
    }
    return result;
  }

  async delete(_id: string, session: Session): Promise<boolean> {
    this._log.info(`Role Id: ${_id} - By ${session._id}`, 'Delete');
    if (_id == Roles.Admin || _id == Roles.User) {
      return false;
    }

    const result = await this.roleRepository.deleteOne({ _id });
    if (result) {
      this.eventDispatcher.dispatch(events.role.deleted, _id);
    }
    return result;
  }
}
