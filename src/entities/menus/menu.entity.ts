import {
  prop,
  modelOptions,
  Severity,
} from "@typegoose/typegoose";

import { BaseEntity } from "@entities/base.entity";
import { DataBaseCustomNames } from "@core/enums/dbCustomeNames";
import { AutoMap } from "@automapper/classes";

@modelOptions({
  options: {  allowMixed: Severity.ALLOW, customName: DataBaseCustomNames.Menus },
  schemaOptions: { timestamps: true },
})
export class Menu extends BaseEntity<string> {

  @AutoMap()
  @prop()
  access?: string | string[];

  @AutoMap()
  @prop()
  authority: string[];

  @AutoMap()
  @prop({ default: false })
  hideChildrenInMenu?: boolean;

  @AutoMap()
  @prop({ default: false })
  hideInMenu?: boolean;

  @AutoMap()
  @prop()
  icon?: string;

  @AutoMap()
  @prop()
  component?: string;

  @AutoMap()
  @prop()
  name?: string;

  @AutoMap()
  @prop()
  path?: string;

  @AutoMap()
  @prop()
  layout?: boolean;

  @AutoMap()
  @prop()
  redirect?: string;

  @AutoMap()
  @prop()
  exact?: boolean;

  @AutoMap()
  @prop({ default: 0 })
  sortOrder?: number;

  @AutoMap()
  @prop()
  parentId?: string;

  @prop({ default: true })
  isActive?: boolean;
}