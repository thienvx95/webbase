import { prop } from "@typegoose/typegoose";

export class GoogleService {
  @prop()  
  sub?: string;
  @prop()  
  access_token?: string;
  @prop()  
  refresh_token?: string;
}

export class UserExternalService {
  @prop(() => GoogleService)  
  google?: GoogleService;
  @prop()  
  facebook?: any;
}
