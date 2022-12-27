import {
    prop,
    getModelForClass,
    modelOptions,
    Severity,
    Ref,
  } from "@typegoose/typegoose";
  
  import { BaseEntity } from "@entities/base.entity";
import { Role } from "@entities/roles/role.entity";
  
  @modelOptions({
    options: {  allowMixed: Severity.ALLOW, customName: "permissions" },
    schemaOptions: { timestamps: true },
  })
  export class Permission extends BaseEntity {
    @prop()
    name?: string;

    @prop({ ref: Role, type: String })
    roles: Ref<Role>[];
  
    @prop({ default: true })
    isActive: boolean;
  }
  
  getModelForClass(Permission);