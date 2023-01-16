import { Session, UserTokenDto } from "@business/auth/model";
import { PaginateOptions, PaginateResult } from "@business/common/model";
import { ChangePasswordRequest, UserDto } from "@business/user/model";
import { TokenPayload } from "google-auth-library";
import { GetTokenResponse } from "google-auth-library/build/src/auth/oauth2client";

export interface IUserService {
    find(): Promise<UserDto[]>;
    findById(id: string): Promise<UserDto>;
    findPaging(option: PaginateOptions): Promise<PaginateResult<UserDto>>;
    findByEmail(email: string): Promise<UserDto>;
    findCreateOrUpdateGooleUser(
      ticket: TokenPayload,
      res: GetTokenResponse,
    ): Promise<void>;
    create(dto: UserDto, session: Session): Promise<UserDto>;
    update(_id: string, dto: UserDto, session: Session): Promise<boolean>;
    updateByEmail(email: string, dto: UserDto, session: Session): Promise<boolean>;
    delete(_id: string): Promise<boolean>;
    changePassword(_id: string, req: ChangePasswordRequest): Promise<boolean>;
    getTokenByUserId(userId: string): Promise<UserTokenDto[]>;
  }