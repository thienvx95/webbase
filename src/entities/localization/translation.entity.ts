import {
    prop,
    getModelForClass,
    modelOptions,
    Severity,
  } from "@typegoose/typegoose";
  
  import { BaseEntity } from "@entities/base.entity";
  
  @modelOptions({
    options: {  allowMixed: Severity.ALLOW, customName: "translations" },
    schemaOptions: { timestamps: true },
  })
  export class Translation extends BaseEntity {
    @prop()
    languageId: string;

    @prop()
    localeKey: string;

    @prop()
    localeValue: boolean;
  }
  
  getModelForClass(Translation);