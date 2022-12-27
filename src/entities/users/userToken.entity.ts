import {
  prop,
  getModelForClass,
  modelOptions,
  Ref,
} from '@typegoose/typegoose';
import { User } from './user.entity';
import { BaseEntity } from '../base.entity';

@modelOptions({
  options: { customName: 'userTokens' },
  schemaOptions: { timestamps: true },
})
export class UserToken extends BaseEntity {
  constructor(init?: Partial<UserToken>) {
    super();
    Object.assign(this, init);
  }
  @prop({ ref: User })
  public user: Ref<User>;

  @prop({ required: true })
  public token: string;

  @prop({ required: true })
  public expires: Date;

  @prop({ required: true })
  public createdByIp: string;

  @prop()
  public revoked?: Date;

  @prop()
  public revokedByIp?: string;

  @prop()
  public replacedByToken?: string;

  public isExpired(): boolean {
    return Date.now() >= new Date(this.expires).getTime();
  }

  public isActive(): boolean {
    return !this.revoked && !this.isExpired();
  }
}
getModelForClass(UserToken);
