import { AutoMap } from '@automapper/classes';

export class AddressDto {
  @AutoMap()
  address1?: string;
  @AutoMap()
  address2?: string;
  @AutoMap()
  zipCode?: string;
  @AutoMap()
  province?: string;
  @AutoMap()
  city?: string;
  @AutoMap()
  country?: string;
}
