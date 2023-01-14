import { AutoMap } from "@automapper/classes";
import { IsArray } from "class-validator";
import { BaseDto } from "../base.dto";

export class MenuDto extends BaseDto {
    @AutoMap(() => [String])
    @IsArray()
    authority: string[];
    
    @AutoMap()
    access: string[] | string;
    
    children: MenuDto[];
    
    @AutoMap()
    hideChildrenInMenu: boolean;
    
    @AutoMap()
    hideInMenu: boolean;
    
    @AutoMap()
    icon: string;
    
    @AutoMap()
    name: string;
    
    @AutoMap()
    component: string;
    
    @AutoMap()
    path: string;
    
    @AutoMap()
    exact: boolean;
    
    @AutoMap()
    sortOrder: number;

    @AutoMap()
    parentId: string;
    
    @AutoMap()
    layout: boolean;
    
    @AutoMap()
    redirect?: string;
  }