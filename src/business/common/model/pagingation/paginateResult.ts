import { IsBoolean, IsArray, IsString, IsOptional } from 'class-validator';

export class PaginateResult<T> {
  constructor(model: any) {
    if (model) {
      this.hasNext = model.hasNext;
      this.hasPrevious = model.hasPrevious;
      this.next = model.next;
      this.previous = model.previous;
    }
  }

  @IsBoolean()
  hasNext?: boolean;

  @IsBoolean()
  hasPrevious?: boolean;

  @IsOptional()
  @IsString()
  next?: string;

  @IsOptional()
  @IsString()
  previous?: string;

  @IsArray()
  results?: T[];
}
