import {
    prop,
    modelOptions,
    Severity,
  } from "@typegoose/typegoose";
  
  import { BaseEntity } from "@entities/base.entity";
import { DataBaseCustomNames } from "@core/enums/dbCustomeNames";
  
  @modelOptions({
    options: {  allowMixed: Severity.ALLOW, customName: DataBaseCustomNames.DomainHosts },
    schemaOptions: { timestamps: true },
  })
  export class DomainHost extends BaseEntity {
    @prop()
    name?: string;

    @prop()
    port?: number;

    @prop()
    languageCode?: string;

    @prop()
    domain: string;

    @prop()
    scheme: string;
    
    @prop()
    primary: boolean;
  }