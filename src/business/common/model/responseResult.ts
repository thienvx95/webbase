import { IsArray, IsBoolean, IsNumber, IsObject, IsString } from "class-validator";

export class ResponseResult<T = any> {
  @IsBoolean()
  success = true;
  @IsString()
  message?: string;

  @IsObject()
  data?: T;

  @IsNumber()
  code?: number;

  @IsArray()
  errors?: string[];
}
