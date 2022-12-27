import {
  IsString,
  IsDate
} from 'class-validator';

export class UserTokenDto {
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
