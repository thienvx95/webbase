import {
    prop,
    getModelForClass,
    modelOptions,
    Severity,
  } from "@typegoose/typegoose";
  
  import { BaseEntity } from "@entities/base.entity";
  
  @modelOptions({
    options: {  allowMixed: Severity.ALLOW, customName: "languages" },
    schemaOptions: { timestamps: true },
  })
  export class Language extends BaseEntity {
    @prop()
    name: string;

    @prop()
    code: string;

    @prop()
    rtl: boolean;

    @prop()
    sortOrder?: number;
    
    @prop({ default: true })
    isActive: boolean;
  }
  
  getModelForClass(Language);