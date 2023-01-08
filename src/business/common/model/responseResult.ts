

import { IsNotEmpty, IsNumber, IsBoolean, IsArray, IsOptional, IsString } from "class-validator";

export class ResponseResult<T = any> {
  @IsNotEmpty()
  @IsBoolean()
  success: boolean;

  @IsOptional()
  @IsString()
  message: string;

  data: T | T[];

  @IsOptional()
  @IsNumber()
  code: number;

  @IsOptional()
  @IsArray()
  errors: string[];
}
