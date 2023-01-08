import { AutoMap } from "@automapper/classes";
import { IsNotEmpty, IsArray, IsString } from "class-validator";

export class MenuDto {
    @AutoMap()
    @IsString()
    @IsNotEmpty()
    id: string;

    @AutoMap()
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