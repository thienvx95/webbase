import { Logging } from '@core/log';
import { PermissionDto } from '@business/common/model';
import { inject, injectable } from 'inversify';
import { Session } from '@business/auth/model';
import { events } from '@business/core/events';
import { Permission } from '@entities/permissions/permission.entity';
import { IAutoMapper, IEventDispatcher, IPermissionService, IRepository } from '@business/core/interface';
import { REPOSITORY_TYPES, COMMON_TYPES } from '@infrastructures/modules';

@injectable()
export class PermissionService implements IPermissionService {
  private readonly _log = Logging.getInstance('MenuService');
  constructor(
    @inject(REPOSITORY_TYPES.PermissionRepository)
    private permissionRepository: IRepository<Permission>,
    @inject(COMMON_TYPES.AutoMapper) private autoMapper: IAutoMapper,
    @inject(COMMON_TYPES.EventDispatcher)
    private eventDispatcher: IEventDispatcher,
  ) {}
  async findAll(): Promise<PermissionDto[]> {
    this._log.info('', 'FindAll');
    const models = await this.permissionRepository.find({});
    return this.autoMapper.MapArray(models, Permission, PermissionDto);
  }

  async findById(id: string): Promise<PermissionDto> {
    this._log.info(`Permission id: ${id}`, 'FindById');
    const model = await this.permissionRepository.findById(id);
    return this.autoMapper.Map(model, Permission, PermissionDto);
  }

  async update(
    _id: string,
    permission: PermissionDto,
    session: Session,
  ): Promise<boolean> {
    this._log.info(
      `Permission id: ${_id} - Data: ${JSON.stringify(permission)} - By ${
        session._id
      }`,
      'Update',
    );
    const result = await this.permissionRepository.updateOne(_id, {
        updatedBy: session._id,
        create: permission.create,
        delete: permission.delete,
        isActive: permission.isActive,
        administer: permission.administer,
        update: permission.update,
        read: permission.read,
    });
    if (result) {
      this.eventDispatcher.dispatch(events.permission.updated, permission);
    }

    return result;
  }
}
