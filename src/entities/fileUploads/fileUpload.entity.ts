import {
  prop,
  getModelForClass,
  modelOptions,
} from "@typegoose/typegoose";
import { BaseEntity } from "@entities/base.entity";

@modelOptions({
  options: { customName: "fileUploads" },
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

getModelForClass(FileUpload);