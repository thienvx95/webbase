import { AutoMap } from '@automapper/classes';
import { BaseDto } from '@business/core/model/base.dto';
import { IsString } from 'class-validator';

export class UserLoginDto extends BaseDto {
  @AutoMap()
  @IsString()
  platform: string;

  @AutoMap()
  @IsString()
  browser: string;

  @AutoMap()
  @IsString()
  ipAddress: string;

  @AutoMap()
  @IsString()
  os: string;

  @AutoMap()
  createdAt: Date;
}
