import { UserDto } from '@business/user/model';
import { UserTokenDto } from '@business/auth/model';
import { User, UserToken } from '@entities/index';
import AutoMapper from './autoMapper';
import { forMember, mapFrom } from '@automapper/core';

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
}
