import {
    prop,
    modelOptions,
    Severity,
  } from "@typegoose/typegoose";
  
  import { BaseEntity } from "@entities/base.entity";
import { DataBaseCustomNames } from "@core/enums/dbCustomeNames";
  
  @modelOptions({
    options: {  allowMixed: Severity.ALLOW, customName: DataBaseCustomNames.Translations },
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