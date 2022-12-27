import {
    prop,
    getModelForClass,
    modelOptions,
    Severity,
  } from "@typegoose/typegoose";
  
  import { BaseEntity } from "@entities/base.entity";
  
  @modelOptions({
    options: {  allowMixed: Severity.ALLOW, customName: "permissionActions" },
    schemaOptions: { timestamps: true },
  })
  export class PermissionAction extends BaseEntity {
    @prop()
    name?: string;

    @prop()
    action: string;
  }
  
  getModelForClass(PermissionAction);