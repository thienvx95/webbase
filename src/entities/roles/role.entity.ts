import { BaseEntity } from "../base.entity";
import {
  prop,
  getModelForClass,
  modelOptions,
} from "@typegoose/typegoose";

@modelOptions({
  options: { customName: "roles" },
  schemaOptions: {
    timestamps: true,
  },
})
export class Role extends BaseEntity<string> {
  constructor(init?: Partial<Role>){
    super();
    Object.assign(this, init);
  }

  @prop()
  public description?: string;

  @prop()
  public roleType?: string;

  @prop({ default: true })
  public isActive: boolean;
}

getModelForClass(Role);