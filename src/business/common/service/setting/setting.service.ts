import { Logging } from '@core/log';
import { SettingDto } from '@business/common/model';
import { inject, injectable } from 'inversify';
import { Session } from '@business/auth/model';
import { events } from '@business/core/events';
import { Setting } from '@entities/settings/setting.entity';
import {
  IAutoMapper,
  IEventDispatcher,
  IRepository,
  ISettingService,
} from '@business/core/interface';
import { REPOSITORY_TYPES, COMMON_TYPES } from '@infrastructures/modules';
import { ErrorEnum } from '@core/enums/error.enum';
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

  async update(
    settings: SettingDto[],
    session: Session,
    out: (errorCode: number) => void,
  ): Promise<boolean> {
    this._log.info('Update settings: ');
    const result = await this.settingRepository.bulkWrite(
      settings.map((data) => ({
        updateOne: {
          filter: { _id: data._id },
          update: { $set: { value: data.value, updatedBy: session._id } },
        },
      })),
    );

    if (result) {
      this.eventDispatcher.dispatch(events.setting.updated, settings);
    } else {
      out(ErrorEnum.Error_Update);
    }

    return result;
  }
}
