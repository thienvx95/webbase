import { AutoMap } from "@automapper/classes";
import { BaseDto } from "@business/common/model/base.dto";
import { IsNotEmpty, IsOptional } from "class-validator";
export class RoleDto extends BaseDto {
  @AutoMap()
  @IsNotEmpty()
  name?: string;

  @AutoMap()
  @IsOptional()
  description?: string;
}
export default RoleDto;
