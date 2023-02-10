import { prop, modelOptions, Ref } from '@typegoose/typegoose';
import { User } from './user.entity';
import { BaseEntity } from '../base.entity';
import { DataBaseCustomNames } from '@core/enums/dbCustomeNames';
import { AutoMap } from '@automapper/classes';

@modelOptions({
  options: { customName: DataBaseCustomNames.UserLogin },
  schemaOptions: { timestamps: true },
})
export class UserLogin extends BaseEntity {
  constructor(init?: Partial<UserLogin>) {
    super();
    Object.assign(this, init);
  }

  @AutoMap(() => [String])
  @prop({ ref: User, type: String })
  userId: Ref<User>;

  @AutoMap()
  @prop()
  platform: string;

  @AutoMap()
  @prop()
  browser: string;

  @AutoMap()
  @prop()
  ipAddress: string;

  @AutoMap()
  @prop()
  os: string;
}
