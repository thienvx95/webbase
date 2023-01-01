import { BaseEntity } from "../base.entity";
import {
  prop,
  modelOptions,
  Severity,
} from "@typegoose/typegoose";
import { DataBaseCustomNames } from "@core/enums/dbCustomeNames";

@modelOptions({
  options: {  allowMixed: Severity.ALLOW, customName: DataBaseCustomNames.Roles },
  schemaOptions: { timestamps: true },
})
export class Role extends BaseEntity<string> {
  @prop()
  public description?: string;

  @prop()
  public roleType?: string;

  @prop({ default: true })
  public isActive?: boolean;
}