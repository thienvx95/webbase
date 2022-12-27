import {
    prop,
    getModelForClass,
    modelOptions,
    Severity,
    plugin,
    Ref,
  } from '@typegoose/typegoose';
  import { Exclude } from 'class-transformer';
  import * as uniqueValidator from 'mongoose-unique-validator';
  import { DATABASE } from '@core/constants';
  import { BaseEntity } from '../base.entity';
  import { Role } from '../roles/role.entity';
  
  export interface IUserServices {
    google?: IGoogleService;
    facebook?: any;
  }
  export interface IGoogleService {
    sub?: string;
    access_token?: string;
    refresh_token?: string;
  }

  
//   @pre<User>('save', function (_next: any) {
//     if (!this.isModified('password')) {
//       return _next();
//     }
//     PasswordUtil.encryptPassword(2, this.password).then((x) => {
//       this.password = x;
//     });
//   })
  @modelOptions({
    options: { allowMixed: Severity.ALLOW, customName: "users", },
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
  
    @prop({
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      text: true,
      index: true,
    })
    username!: string;
  
    @Exclude()
    @prop({ required: true })
    password!: string;
  
    @prop({ required: true })
    fullname!: string;
  
    @prop()
    avatar?: string;
  
    @prop()
    address: string;
  
    @prop({
      enum: [DATABASE.GENDER.FEMALE, DATABASE.GENDER.MALE],
      default: 'Male',
    })
    gender: string;
  
    @prop({ default: Date.now() })
    dob: Date;
  
    @prop()
    services?: IUserServices;
  
    @prop()
    lastLogin?: Date;
  
    @prop({ default: 'en' })
    language?: string;
  
    @prop({ ref: Role, type: String })
    public roles: Ref<Role>[];
  
    @prop()
    mobile: string;
  
    @prop({ default: true })
    isActive: boolean;
  }
  
  getModelForClass(User);
  