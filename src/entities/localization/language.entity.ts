import {
    prop,
    modelOptions,
    Severity,
  } from "@typegoose/typegoose";
  
  import { BaseEntity } from "@entities/base.entity";
import { DataBaseCustomNames } from "@core/enums/dbCustomeNames";
  
  @modelOptions({
    options: {  allowMixed: Severity.ALLOW, customName: DataBaseCustomNames.Languages },
    schemaOptions: { timestamps: true },
  })
  export class Language extends BaseEntity<string> {
    constructor(init?: Partial<string>){
      super();
      Object.assign(this, init);
    }
    @prop()
    name: string;

    @prop()
    rtl: boolean;

    @prop()
    sortOrder?: number;
    
    @prop({ default: true })
    isActive?: boolean;
  }