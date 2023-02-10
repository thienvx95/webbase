import { BaseDto } from '@business/core/model/base.dto';
import { IsString, IsDate } from 'class-validator';

export class UserTokenDto extends BaseDto {
  user?: any;
  @IsString()
  token?: string;
  @IsDate()
  expires?: Date;
  @IsString()
  createdByIp?: string;
  @IsDate()
  revoked?: Date;
  @IsString()
  revokedByIp?: string;
  @IsString()
  replacedByToken?: string;
}
