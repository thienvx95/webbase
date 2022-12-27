import type { Types } from 'mongoose';
import { PaginateOptions, PaginateResult } from "@business/common/model";
import { prop, plugin, modelOptions, Severity } from '@typegoose/typegoose';
import { mongoosePlugin } from 'mongo-cursor-pagination';

@modelOptions({
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: {
    timestamps: true,
  },
})
@plugin(mongoosePlugin)
export class BaseEntity<T = Types.ObjectId> {
  @prop()
  _id: T;

  @prop()
  updatedBy?: string;

  @prop()
  createdBy?: string;

  static paginate<T, K>(this: T, options: PaginateOptions): PaginateResult<K> {
    return (this as any).paginate(options);
  }
}