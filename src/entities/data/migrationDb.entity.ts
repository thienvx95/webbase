import {
    prop,
    getModelForClass,
    modelOptions,
    Severity,
  } from "@typegoose/typegoose";
  
  import { BaseEntity } from "@entities/base.entity";
  
  @modelOptions({
    options: {  allowMixed: Severity.ALLOW, customName: "migrationDb" },
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
  
  getModelForClass(MigrationDb);