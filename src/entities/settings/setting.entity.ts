import { DataBaseCustomNames } from "@core/enums/dbCustomeNames";
import {
    prop,
    modelOptions,
    Severity
  } from "@typegoose/typegoose";
  
  export type SettingValue = string | boolean | number | string[] | undefined;
  
  export interface ISettingSelectOption {
      value: string;
      label: string;
  }
  
  @modelOptions({
    options: { allowMixed: Severity.ALLOW, customName: DataBaseCustomNames.Settings },
  })
  export class Setting {
    constructor(init?: Partial<Setting>){
      Object.assign(this, init);
    }
    @prop()
    _id?: string;
  
    @prop()
      type?: string;
  
    @prop()
      public?: boolean;
  
    @prop()
      group?: string;
  
    @prop()
      section?: string;
  
    @prop()
      name?: string;
  
    @prop()
      value?: SettingValue;
  
    @prop()
    sorter?: number;
  
    @prop()
    hidden?: boolean;
  
    @prop()
    description?: string;
  
    @prop()
      values?: ISettingSelectOption[];
  
    @prop()
    updatedBy?: string;
  
    @prop()
    createdBy?: string;
  }