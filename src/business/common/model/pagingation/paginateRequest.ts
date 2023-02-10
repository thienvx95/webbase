import { IsNumber, IsOptional, IsObject, IsString } from 'class-validator';

export class PaginateRequest {
  @IsNumber()
  limit?: number = 10;

  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsObject()
  filter?: Record<string, string[] | boolean[]> = null;

  @IsOptional()
  @IsObject()
  search?: Record<string, string> = null;

  @IsOptional()
  @IsObject()
  sort?: Record<string, string> = null;

  @IsOptional()
  @IsString()
  next?: string = null;

  @IsOptional()
  @IsString()
  previous?: string = null;
}
