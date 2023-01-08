import { IsNotEmpty, IsArray, IsBoolean } from "class-validator";

export class EditMenuDto {
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;

  @IsNotEmpty()
  @IsArray()
  authority: string[];
}