import { prop, plugin, modelOptions, Severity } from '@typegoose/typegoose';
import * as paginate from 'mongoose-paginate-v2';
import { AutoMap } from '@automapper/classes';
import { v4 as uuidv4 } from 'uuid';
@modelOptions({
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: {
    timestamps: true,
  },
})
@plugin(paginate)
export class BaseEntity {
  @AutoMap()
  @prop({ default: uuidv4() })
  _id?: string;

  @AutoMap()
  @prop({ default: new Date() })
  createdAt?: Date;

  @prop()
  updatedBy?: string;

  @prop()
  createdBy?: string;
}
