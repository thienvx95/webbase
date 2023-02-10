import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Address } from '@entities/common/address';
import { BaseDto } from '@business/core/model/base.dto';
export class UpdateProfileRequest extends BaseDto {
  @IsNotEmpty()
  @IsString()
  @Length(0, 50)
  firstName?: string;

  @IsNotEmpty()
  @IsString()
  @Length(0, 50)
  lastName?: string;

  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @Length(0, 50)
  email?: string;

  @IsOptional()
  public address?: Address;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  mobile?: string;
}
