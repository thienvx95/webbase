
import { Menu, Permission, Role, Setting, User, UserToken } from '@entities/index';
import AutoMapper from './autoMapper';
import { forMember, mapFrom } from '@automapper/core';
import { MenuDto, PermissionDto, SettingDto } from '@business/common/model';
import { RoleDto } from '@business/role/model/role.dto';
import { UserDto } from '@business/user/model';
import { UserTokenDto } from '@business/auth/model';

export function MapDtoToEntity(autoMapper: AutoMapper): void {
  autoMapper.createMap(
    UserDto,
    User,
    forMember(
      (destination) => destination._id.toString(),
      mapFrom((source) => source.id),
    ),
  );
  autoMapper.createMap(UserTokenDto, UserToken);
}

export function MapEntityToDto(autoMapper: AutoMapper): void {
  autoMapper.createMap(
    User,
    UserDto,
    forMember(
      (destination) => destination.id,
      mapFrom((source) => source._id.toString()),
    ),
    forMember(
      (destination) => destination.roles,
      mapFrom((source) => source.roles),
    ),
  );

  autoMapper.createMap(UserToken, UserTokenDto);
  autoMapper.createMap(
    Menu,
    MenuDto,
    forMember(
      (destination) => destination.id,
      mapFrom((source) => source._id),
    ),
    forMember(
      (destination) => destination.authority,
      mapFrom((source) => source.authority),
    ),
  );

  autoMapper.createMap(
    Role,
    RoleDto,
    forMember(
      (destination) => destination.id,
      mapFrom((source) => source._id),
    ),
  );

  autoMapper.createMap(
    Permission,
    PermissionDto,
    forMember(
      (destination) => destination.id,
      mapFrom((source) => source._id.toString()),
    ),
    forMember(
      (destination) => destination.function,
      mapFrom((source) => source.function),
    ),
    forMember(
      (destination) => destination.roles,
      mapFrom((source) => source.roles),
    ),
  );

  autoMapper.createMap(
    Setting,
    SettingDto,
    forMember(
      (destination) => destination.id,
      mapFrom((source) => source._id.toString()),
    ),
  );
}
