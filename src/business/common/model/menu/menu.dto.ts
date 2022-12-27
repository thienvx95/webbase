export class MenuDto {
    _id?: string;
    authority?: string | string[];
    access?: string[] | string;
    children?: MenuDto[];
    hideChildrenInMenu?: boolean;
    hideInMenu?: boolean;
    icon?: string;
    name?: string;
    component?: string;
    path?: string;
    exact?: boolean;
    sortOrder?: number;
    parentId?: string;
    layout?: boolean;
    redirect?: string;
    isActive?: boolean;
  }