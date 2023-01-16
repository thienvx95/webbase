import { AutoMap } from '@automapper/classes';
import { prop } from '@typegoose/typegoose';

export class Address {
  @AutoMap()
  @prop()
  address1?: string;
  @AutoMap()
  @prop()
  address2?: string;
  @AutoMap()
  @prop()
  zipCode?: string;
  @AutoMap()
  @prop()
  province?: string;
  @AutoMap()
  @prop()
  city?: string;
  @AutoMap()
  @prop()
  country?: string;
}
