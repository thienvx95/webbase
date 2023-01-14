import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsString,
  Length,
} from 'class-validator';
import { AutoMap } from '@automapper/classes';
import { Address } from '@entities/common/address';
import { BaseDto } from '@business/common/model/base.dto';
export class UserDto extends BaseDto  {
  @AutoMap()
  @IsNotEmpty()
  @IsString()
  @Length(0, 50)
  firstName?: string;

  @AutoMap()
  @IsNotEmpty()
  @IsString()
  @Length(0, 50)
  lastName?: string;

  @AutoMap()
  @IsNotEmpty()
  username?: string;

  @AutoMap()
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @Length(0, 50)
  email?: string;

  @AutoMap(() => Address)
  @IsOptional()
  public address?: Address;

  @AutoMap(() => [String])
  @IsNotEmpty()
  @IsArray()
  roles?: string[];

  @AutoMap()
  @IsOptional()
  @IsString()
  avatar?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  @Length(0, 20)
  mobile?: string;

  @AutoMap()
  @IsOptional()
  isActive?: boolean;
}
