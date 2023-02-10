import { IsString, IsBoolean, IsArray, IsObject } from 'class-validator';
import { AutoMap } from '@automapper/classes';
import {
  ISettingSelectOption,
  SettingValue,
} from '@entities/settings/setting.entity';
import { BaseDto } from '../../../core/model/base.dto';

export class SettingDto extends BaseDto {
  @AutoMap()
  @IsString()
  type:
    | string
    | 'boolean'
    | 'string'
    | 'int'
    | 'select'
    | 'multiSelect'
    | 'font'
    | 'date';

  @AutoMap()
  @IsBoolean()
  public: boolean;

  @AutoMap()
  @IsString()
  group?: string;

  @AutoMap()
  @IsString()
  section?: string;

  @AutoMap()
  @IsString()
  name: string;

  @AutoMap()
  @IsObject()
  value: SettingValue;

  @AutoMap()
  @IsString()
  description?: string;

  @AutoMap()
  @IsArray()
  values?: Array<ISettingSelectOption>;
}
