import { prop, modelOptions, Ref } from '@typegoose/typegoose';
import { BaseEntity } from '@entities/base.entity';
import { DataBaseCustomNames } from '@core/enums/dbCustomeNames';
import { AutoMap } from '@automapper/classes';
import { User } from '@entities/users/user.entity';

@modelOptions({
  options: { customName: DataBaseCustomNames.FileUploads },
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

  @AutoMap(() => [String])
  @prop({ ref: User, type: String })
  userId: Ref<User>;

  @AutoMap()
  @prop()
  extension?: string;

  @AutoMap()
  @prop()
  path?: string;

  @AutoMap()
  @prop()
  storage?: string;

  @AutoMap()
  @prop()
  public: boolean;
}
