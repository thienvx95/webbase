import {
  prop,
  modelOptions,
} from "@typegoose/typegoose";
import { BaseEntity } from "@entities/base.entity";
import { DataBaseCustomNames } from "@core/enums/dbCustomeNames";
import { AutoMap } from "@automapper/classes";

@modelOptions({
  options: { customName: DataBaseCustomNames.FileUploads  },
  schemaOptions: {
    timestamps: true,
  },
})
export class FileUpload extends BaseEntity {

  @AutoMap()
  @prop()
  name?: string;

  @AutoMap()
  @prop()
  size?: number;

  @AutoMap()
  @prop()
  type?: string;

  @AutoMap()
  @prop()
  extension?: string;

  @AutoMap()
  @prop()
  path?: string;

  @AutoMap()
  @prop()
  storage?:string;
}