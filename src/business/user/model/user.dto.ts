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
export class UserDto {
  @IsNotEmpty()
  id?: string;
  
  @IsNotEmpty()
  @IsString()
  @Length(0, 50)
  fullname?: string;

  @IsNotEmpty()
  username?: string;

  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @Length(0, 50)
  email?: string;

  @IsEnum([DATABASE.GENDER.MALE, DATABASE.GENDER.FEMALE])
  @IsOptional()
  gender?: string;

  @IsOptional()
  @IsString()
  @Length(0, 50)
  public address?: string;

  @IsNotEmpty()
  @IsArray()
  roles?: string[];

  @IsOptional()
  @IsDateString()
  dob?: Date;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  mobile?: string;

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
