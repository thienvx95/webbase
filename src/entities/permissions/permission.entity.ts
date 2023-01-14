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
import { AutoMap } from "@automapper/classes";
  
  @modelOptions({
    options: {  allowMixed: Severity.ALLOW, customName: DataBaseCustomNames.Permissions },
    schemaOptions: { timestamps: true },
  })
  export class Permission extends BaseEntity {
    @AutoMap()
    @prop()
    name?: string;

    @AutoMap(() => String)
    @prop({ ref: Menu })
    function?: Ref<Menu, string>;
    
    @AutoMap(() => [String])
    @prop({ ref: Role, type: String })
    roles?: Ref<Role>[];
  
    @AutoMap()
    @prop()
    create: boolean;
  
    @AutoMap()
    @prop()
    delete: boolean;
  
    @AutoMap()
    @prop()
    update: boolean;
  
    @AutoMap()
    @prop()
    read: boolean;
  
    @AutoMap()
    @prop()
    administer: boolean;

    @AutoMap()
    @prop({ default: true })
    isActive: boolean;
  }