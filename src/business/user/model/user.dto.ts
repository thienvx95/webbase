import {
  IsEmail,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsArray,
  IsDateString,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { DATABASE, PasswordRegex } from '@core/constants';
import { AutoMap } from '@automapper/classes';
export class UserDto {

  @AutoMap()
  @IsNotEmpty()
  id?: string;
  
  @AutoMap()
  @IsNotEmpty()
  @IsString()
  @Length(0, 50)
  fullname?: string;

  @AutoMap()
  @IsNotEmpty()
  username?: string;

  @AutoMap()
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @Length(0, 50)
  email?: string;

  @AutoMap()
  @IsEnum([DATABASE.GENDER.MALE, DATABASE.GENDER.FEMALE])
  @IsOptional()
  gender?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  @Length(0, 50)
  public address?: string;

  @AutoMap()
  @IsNotEmpty()
  @IsArray()
  roles?: string[];

  @AutoMap()
  @IsOptional()
  @IsDateString()
  dob?: Date;

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

  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/, {
    message:
      "At least 8 characters, with at least one number, one special character, one uppercase letter and one lowercase letter.",
  })
  @IsNotEmpty()
  @IsString()
  @Matches(PasswordRegex, {message: "Password too weak"})
  password: string;
}
