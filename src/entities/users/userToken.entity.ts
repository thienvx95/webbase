import {
  prop,
  modelOptions,
  Ref,
} from '@typegoose/typegoose';
import { User } from './user.entity';
import { BaseEntity } from '../base.entity';
import { DataBaseCustomNames } from '@core/enums/dbCustomeNames';
import { AutoMap } from '@automapper/classes';

@modelOptions({
  options: { customName: DataBaseCustomNames.UserTokens },
  schemaOptions: { timestamps: true },
})
export class UserToken extends BaseEntity {
  constructor(init?: Partial<UserToken>) {
    super();
    Object.assign(this, init);
  }

  
  @AutoMap(() => [String])
  @prop({ ref: User, type: String })
  user: Ref<User>;

  @AutoMap()
  @prop({ required: true })
  token: string;

  @AutoMap()
  @prop({ required: true })
  expires: Date;

  @AutoMap()
  @prop({ required: true })
  createdByIp: string;

  @AutoMap()
  @prop()
  revoked?: Date;

  @AutoMap()
  @prop()
  revokedByIp?: string;

  @AutoMap()
  @prop()
  replacedByToken?: string;

  public isExpired(): boolean {
    return Date.now() >= new Date(this.expires).getTime();
  }

  public isActive(): boolean {
    return !this.revoked && !this.isExpired();
  }
}
