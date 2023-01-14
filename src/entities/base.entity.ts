import { prop, plugin, modelOptions, Severity } from '@typegoose/typegoose';
import { mongoosePlugin } from 'mongo-cursor-pagination';
import { AutoMap } from '@automapper/classes';
import { v4 as uuidv4 } from 'uuid';
@modelOptions({
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: {
    timestamps: true,
  },
})

@plugin(mongoosePlugin)
export class BaseEntity {
  @AutoMap()
  @prop({ default: uuidv4() })
  _id?: string;

  @prop()
  updatedBy?: string;

  @prop()
  createdBy?: string;
}
