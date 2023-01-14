import { IsString, IsBoolean, IsArray, IsNotEmpty } from "class-validator";
import { AutoMap } from "@automapper/classes";
import { BaseDto } from "../base.dto";

export class PermissionDto extends BaseDto {
    @AutoMap(() => String)
    @IsString()
    @IsNotEmpty()
    function: string;
    
    @AutoMap(() => [String])
    @IsArray()
    @IsNotEmpty()
    roles: string[];
  
    @AutoMap()
    @IsBoolean()
    @IsNotEmpty()
    create: boolean;

    @AutoMap()
    @IsBoolean()
    @IsNotEmpty()
    delete: boolean;
  
    @AutoMap()
    @IsBoolean()
    @IsNotEmpty()
    update: boolean;
  
    @AutoMap()
    @IsBoolean()
    @IsNotEmpty()
    read: boolean;
  
    @AutoMap()
    @IsBoolean()
    @IsNotEmpty()
    administer: boolean;

    @IsBoolean()
    isActive: boolean
}