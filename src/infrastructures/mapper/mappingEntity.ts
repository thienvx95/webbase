import { UserDto } from "@business/user/model";
import { UserTokenDto } from '@business/auth/model';
import { User, UserToken } from "@entities/index";
import AutoMapper from "./autoMapper";

export function MapDtoToEntity(autoMapper: AutoMapper): void {
    autoMapper.createMap(UserDto, User);
    autoMapper.createMap(UserTokenDto, UserToken);
}

export function MapEntityToDto(autoMapper: AutoMapper): void {
    autoMapper.createMap(User, UserDto);
    autoMapper.createMap(UserToken, UserTokenDto);
}