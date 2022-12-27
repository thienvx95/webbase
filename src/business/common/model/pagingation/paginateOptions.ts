
import { IsNumber, IsOptional, IsObject, IsString, IsBoolean } from "class-validator";

export class PaginateOptions {
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsObject()
  filter?: Record<string, string[] | boolean[]>;

  @IsOptional()
  @IsObject()
  search?: Record<string, string>;

  @IsOptional()
  @IsObject()
  sort?: Record<string, string>;

  @IsOptional()
  @IsString()
  next?: string;

  @IsOptional()
  @IsString()
  previous?: string;

  query?: Record<string, unknown>;
  fields?: Record<string, unknown>;

  @IsString()
  paginatedField?: string;

  @IsBoolean()
  sortAscending?: boolean;
}