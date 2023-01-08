import {
    prop,
    modelOptions,
    Severity,
    Ref,
  } from "@typegoose/typegoose";
  
  import { BaseEntity } from "@entities/base.entity";
import { Role } from "@entities/roles/role.entity";
import { DataBaseCustomNames } from "@core/enums/dbCustomeNames";
import { Menu } from "..";
  
  @modelOptions({
    options: {  allowMixed: Severity.ALLOW, customName: DataBaseCustomNames.Permissions },
    schemaOptions: { timestamps: true },
  })
  export class Permission extends BaseEntity {
    @prop()
    name?: string;

    @prop({ ref: Menu })
    function?: Ref<Menu, string>;
    
    @prop({ ref: Role, type: String })
    roles?: Ref<Role>[];
  
    @prop()
    create: boolean;
  
    @prop()
    delete: boolean;
  
    @prop()
    update: boolean;
  
    @prop()
    read: boolean;
  
    @prop()
    administer: boolean;

    @prop({ default: true })
    isActive: boolean;
  }