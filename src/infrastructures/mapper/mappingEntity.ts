import {
  Menu,
  Permission,
  Role,
  Setting,
  User,
  UserToken,
} from '@entities/index';
import AutoMapper from './autoMapper';
import { MenuDto, PermissionDto, SettingDto } from '@business/common/model';
import { RoleDto } from '@business/role/model/role.dto';
import { UserDto } from '@business/user/model';
import { UserTokenDto } from '@business/auth/model';
import { BaseEntity } from '@entities/base.entity';
import { BaseDto } from '@business/common/model/base.dto';
import { Address } from '@entities/common/address';
import { AddressDto } from '@business/common/model/address/address.dto';

export function MapEntityToDto(autoMapper: AutoMapper): void {
  autoMapper.createMap(BaseEntity, BaseDto);
  autoMapper.createMap(Address, AddressDto);
  autoMapper.createMap(User, UserDto);
  autoMapper.createMap(UserToken, UserTokenDto);
  autoMapper.createMap(Menu, MenuDto);
  autoMapper.createMap(Role, RoleDto);
  autoMapper.createMap(Permission, PermissionDto);
  autoMapper.createMap(Setting, SettingDto);
  // Example
  // autoMapper.createMap(BaseEntity, BaseDto,
  //   forMember(
  //   (destination) => destination.id,
  //   mapFrom((source) => source._id.toString()),
  // ));
}
