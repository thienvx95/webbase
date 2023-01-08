import { IsString, IsBoolean, IsArray, IsNotEmpty } from "class-validator";
import { AutoMap } from "@automapper/classes";

export class PermissionDto {

    @AutoMap()
    @IsString()
    @IsNotEmpty()
    id?: string;

    @AutoMap()
    @IsString()
    @IsNotEmpty()
    function: string;
    
    @AutoMap()
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