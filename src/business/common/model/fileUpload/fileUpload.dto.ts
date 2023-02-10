import { AutoMap } from '@automapper/classes';
import { IsNumber, IsString } from 'class-validator';
import { BaseDto } from '../../../core/model/base.dto';

export class FileUploadDto extends BaseDto {
  @AutoMap()
  @IsString()
  name?: string;
  @IsNumber()
  @AutoMap()
  size?: number;
  @AutoMap()
  @IsString()
  type?: string;
  @AutoMap()
  @IsString()
  extension?: string;
  @AutoMap()
  @IsString()
  path?: string;
  @AutoMap()
  @IsString()
  storage?: string;
}
