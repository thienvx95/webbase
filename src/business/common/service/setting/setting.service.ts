import { Logging } from '@core/log';
import { SettingDto } from '@business/common/model';
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
import { Setting } from '@entities/settings/setting.entity';

export interface ISettingService {
  findGroup(): Promise<SettingDto[]>;
  findByGroup(id: string): Promise<SettingDto[]>;
  update(settings: SettingDto[], session: Session): Promise<boolean>;
}

@injectable()
export class SettingService implements ISettingService {
  private readonly _log = Logging.getInstance('SettingService');
  constructor(
    @inject(REPOSITORY_TYPES.SettingRepository)
    private settingRepository: IRepository<Setting>,
    @inject(COMMON_TYPES.AutoMapper) private autoMapper: IAutoMapper,
    @inject(COMMON_TYPES.EventDispatcher)
    private eventDispatcher: IEventDispatcher,
  ) {}
  async findGroup(): Promise<SettingDto[]> {
    this._log.info('', 'FindGroup');
    const result = await this.settingRepository.find({ type: 'group' }, null, {
      sort: { sort: 1 },
    });
    return this.autoMapper.MapArray(result, Setting, SettingDto);
  }

  async findByGroup(id: string): Promise<SettingDto[]> {
    this._log.info('', 'FindByGroup');
    const result = await this.settingRepository.find({ group: id });
    return this.autoMapper.MapArray(result, Setting, SettingDto);
  }

  async update(settings: SettingDto[], session: Session): Promise<boolean> {
    this._log.info('Update settings: ');
    const result = await this.settingRepository.bulkWrite(
      settings.map((data) => ({
        updateOne: {
          filter: { _id: data.id },
          update: { $set: { value: data.value, updatedBy: session._id } },
        },
      })),
    );

    if (result) {
      this.eventDispatcher.dispatch(events.setting.updated, settings);
    }

    return result;
  }
}
