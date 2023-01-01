import type { Types } from 'mongoose';
import { prop, plugin, modelOptions, Severity } from '@typegoose/typegoose';
import { mongoosePlugin } from 'mongo-cursor-pagination';
import { AutoMap } from '@automapper/classes';
@modelOptions({
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: {
    timestamps: true,
  },
})
@plugin(mongoosePlugin)
export class BaseEntity<T = Types.ObjectId> {

  @AutoMap()
  @prop({ auto: true })
  _id?: T;

  @prop()
  updatedBy?: string;

  @prop()
  createdBy?: string;
}
