import {
  prop,
  modelOptions,
  Severity,
} from "@typegoose/typegoose";

import { BaseEntity } from "@entities/base.entity";
import { DataBaseCustomNames } from "@core/enums/dbCustomeNames";

@modelOptions({
  options: {  allowMixed: Severity.ALLOW, customName: DataBaseCustomNames.Menus },
  schemaOptions: { timestamps: true },
})
export class Menu extends BaseEntity<string> {
  @prop()
  access?: string | string[];

  @prop()
  authority: string | string[];

  @prop()
  hideChildrenInMenu?: boolean;

  @prop()
  hideInMenu?: boolean;

  @prop()
  icon?: string;

  @prop()
  component?: string;

  @prop()
  name?: string;

  @prop()
  path?: string;

  @prop()
  layout?: boolean;

  @prop()
  redirect?: string;

  @prop()
  exact?: boolean;

  @prop()
  sortOrder?: number;

  @prop()
  parentId?: string;

  @prop({ default: true })
  isActive?: boolean;
}