import {
  prop,
  getModelForClass,
  modelOptions,
  Severity,
} from "@typegoose/typegoose";

import { BaseEntity } from "@entities/base.entity";

@modelOptions({
  options: {  allowMixed: Severity.ALLOW, customName: "menus" },
  schemaOptions: { timestamps: true },
})
export class Menu extends BaseEntity {
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

  @prop({ required: true })
  path: string;

  @prop()
  layout: boolean;

  @prop()
  redirect?: string;

  @prop()
  exact?: boolean;

  @prop()
  sortOrder?: number;

  @prop()
  parentId?: string;

  @prop({ default: true })
  isActive: boolean;
}

getModelForClass(Menu);