import {
    prop,
    getModelForClass,
    modelOptions,
    Severity,
  } from "@typegoose/typegoose";
  
  import { BaseEntity } from "@entities/base.entity";
import { ApplicationVersion } from "@core/constants";
import { SystemConfig } from "@core/configuration";
  
  @modelOptions({
    options: {  allowMixed: Severity.ALLOW, customName: "applicationInfo" },
    schemaOptions: { timestamps: true },
  })
  export class ApplicationInfo extends BaseEntity {
    constructor(dbMigration: string, isInstall: boolean){
        super();
        this.version = ApplicationVersion;
        this.nodeVersion = process.version;
        this.databaseMigration = dbMigration;
        this.isInstall = isInstall;
        this.dbVersion = SystemConfig.DbVersion;
        this.dbProvider = SystemConfig.DbProvider;
    }

    @prop()
    version: string;

    @prop()
    nodeVersion: string;
    
    @prop()
    databaseMigration: string;

    @prop()
    dbVersion: string;

    @prop()
    dbProvider: string;

    @prop()
    isInstall: boolean;
  }
  
  getModelForClass(ApplicationInfo);