import {
    prop,
    getModelForClass,
    modelOptions,
    Severity,
  } from "@typegoose/typegoose";
  
  import { BaseEntity } from "@entities/base.entity";
  
  @modelOptions({
    options: {  allowMixed: Severity.ALLOW, customName: "domainHosts" },
    schemaOptions: { timestamps: true },
  })
  export class DomainHost extends BaseEntity {
    @prop()
    name?: string;

    @prop()
    hostName?: string;

    @prop()
    languageCode?: string;

    @prop()
    domain: string;

    @prop()
    scheme: string;
    
    @prop()
    primary: boolean;
  }
  
  getModelForClass(DomainHost);