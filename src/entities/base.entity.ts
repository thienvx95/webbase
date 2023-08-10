import { prop, plugin, modelOptions, Severity } from '@typegoose/typegoose';
import { mongoosePagination } from 'mongoose-paginate-ts';
import { AutoMap } from '@automapper/classes';
import { v4 as uuidv4 } from 'uuid';
@modelOptions({
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: {
    timestamps: true,
  },
})
@plugin(mongoosePagination)
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
