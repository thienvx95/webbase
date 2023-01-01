import {
    prop,
    modelOptions,
    Severity,
  } from "@typegoose/typegoose";
  
  import { BaseEntity } from "@entities/base.entity";
import { DataBaseCustomNames } from "@core/enums/dbCustomeNames";
  
  @modelOptions({
    options: {  allowMixed: Severity.ALLOW, customName: DataBaseCustomNames.PermissionActions },
    schemaOptions: { timestamps: true },
  })
  export class PermissionAction extends BaseEntity {
    @prop()
    name?: string;

    @prop()
    action: string;
  }