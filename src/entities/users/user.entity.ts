import {
    prop,
    modelOptions,
    Severity,
    plugin,
    Ref,
  } from '@typegoose/typegoose';
  import { Exclude } from 'class-transformer';
  import * as uniqueValidator from 'mongoose-unique-validator';
  import { BaseEntity } from '../base.entity';
  import { Role } from '../roles/role.entity';
import { DataBaseCustomNames } from '@core/enums/dbCustomeNames';
import { AutoMap } from '@automapper/classes';
import { Address } from '@entities/common/address';
  
  export interface IUserServices {
    google?: IGoogleService;
    facebook?: any;
  }
  export interface IGoogleService {
    sub?: string;
    access_token?: string;
    refresh_token?: string;
  }

  @modelOptions({
    options: { allowMixed: Severity.ALLOW, customName: DataBaseCustomNames.Users },
    schemaOptions: {
      timestamps: true,
    },
  })
  @plugin(uniqueValidator)
  export class User extends BaseEntity {
    constructor(init?: Partial<User>) {
      super();
      Object.assign(this, init);
    }

    @AutoMap()
    @prop({
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      text: true,
      match: [/\S+@\S+\.\S+/, 'is invalid'],
      index: true,
    })
    email!: string;
  
    @AutoMap()
    @prop({
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      text: true,
      index: true,
    })
    username?: string;
  
    @Exclude()
    @prop({ required: true })
    password!: string;
  
    @AutoMap()
    @prop()
    firstName?: string;

    @AutoMap()
    @prop()
    lastName?:string;

    @AutoMap()
    @prop()
    avatar?: string;
  
    @AutoMap()
    @prop()
    address?: Address;

    @AutoMap()
    @prop()
    services?: IUserServices;
  
    @prop()
    lastLogin?: Date;
  
    @AutoMap()
    @prop({ default: 'en' })
    language?: string;
  
    @AutoMap(() => [String])
    @prop({ ref: Role, type: String })
    public roles: Ref<Role>[];
  
    @AutoMap()
    @prop()
    mobile: string;
  
    @AutoMap()
    @prop({ default: true })
    isActive?: boolean;
  }