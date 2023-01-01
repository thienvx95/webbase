import {
  prop,
  modelOptions,
} from "@typegoose/typegoose";
import { BaseEntity } from "@entities/base.entity";
import { DataBaseCustomNames } from "@core/enums/dbCustomeNames";

@modelOptions({
  options: { customName: DataBaseCustomNames.FileUploads  },
  schemaOptions: {
    timestamps: true,
  },
})
export class FileUpload extends BaseEntity {
  @prop()
  name?: string;

  @prop()
  size?: number;

  @prop()
  type?: string;

  @prop()
  extension?: string;

  @prop()
  path?: string;
}