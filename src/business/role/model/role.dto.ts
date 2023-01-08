import { AutoMap } from "@automapper/classes";
import { IsNotEmpty, IsOptional } from "class-validator";
export class RoleDto {
  @AutoMap()
  @IsNotEmpty()
  id?: string;

  @AutoMap()
  @IsNotEmpty()
  name?: string;

  @AutoMap()
  @IsOptional()
  description?: string;
}
export default RoleDto;
