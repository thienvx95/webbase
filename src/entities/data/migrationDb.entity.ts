import {
    prop,
    modelOptions,
    Severity,
  } from "@typegoose/typegoose";
  
  import { BaseEntity } from "@entities/base.entity";
import { DataBaseCustomNames } from "@core/enums/dbCustomeNames";
  
  @modelOptions({
    options: {  allowMixed: Severity.ALLOW, customName: DataBaseCustomNames.MigrationDb  },
    schemaOptions: { timestamps: true },
  })
  export class MigrationDb extends BaseEntity {
    @prop()
    version: string;
    
    @prop()
    name: string;

    @prop()
    isInstall: boolean;
  }