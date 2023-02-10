import { Session, UserTokenDto } from '@business/auth/model';
import { PaginateResult } from '@business/common/model';
import { PaginateRequest } from '@business/common/model/pagingation/paginateRequest';
import {
  ChangePasswordRequest,
  UserDto,
  UserLoginDto,
} from '@business/user/model';
import { TokenPayload } from 'google-auth-library';
import { GetTokenResponse } from 'google-auth-library/build/src/auth/oauth2client';

export interface IUserService {
  find(): Promise<UserDto[]>;
  findById(id: string): Promise<UserDto>;
  findPaging(
    paginateRequest: PaginateRequest,
  ): Promise<PaginateResult<UserDto>>;
  findByEmail(email: string): Promise<UserDto>;
  findCreateOrUpdateGooleUser(
    ticket: TokenPayload,
    res: GetTokenResponse,
  ): Promise<void>;
  create(
    dto: UserDto,
    session: Session,
    out: (errorCode: number) => void,
  ): Promise<UserDto>;
  update(
    _id: string,
    dto: UserDto,
    session: Session,
    out: (errorCode: number) => void,
  ): Promise<boolean>;
  updateByEmail(
    email: string,
    dto: UserDto,
    session: Session,
    out: (errorCode: number) => void,
  ): Promise<boolean>;
  delete(_id: string, out: (errorCode: number) => void): Promise<boolean>;
  changePassword(
    _id: string,
    req: ChangePasswordRequest,
    out: (errorCode: number) => void,
  ): Promise<boolean>;
  getTokenByUserId(userId: string): Promise<UserTokenDto[]>;
  getUserLogin(
    paginateRequest: PaginateRequest,
  ): Promise<PaginateResult<UserLoginDto>>;
  deleteUserLoginActivity(
    id: string,
    session: Session,
    out: (errorCode: number) => void,
  ): Promise<boolean>;
  deleteAllUserLoginActivity(
    session: Session,
    out: (errorCode: number) => void,
  ): Promise<boolean>;
}
