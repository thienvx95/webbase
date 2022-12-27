

import { IsNotEmpty, IsString, IsBoolean, IsArray, IsOptional } from "class-validator";

export class ResponseResult<T = any> {
  @IsNotEmpty()
  @IsBoolean()
  success: boolean;

  @IsOptional()
  @IsString()
  message: string;

  data: T | T[];

  @IsOptional()
  @IsString()
  errorCode: string;

  @IsOptional()
  @IsArray()
  errors: string[];
}
