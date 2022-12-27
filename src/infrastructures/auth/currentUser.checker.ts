import { Action } from "routing-controllers";
import { verify } from "jsonwebtoken";
import { HttpStatusError, ErrorEnum, HttpStatus } from "@core/exception/httpStatusError";
import { SystemConfig } from '@core/configuration';
import { JwtPayload, Session } from "@business/auth/model";
export const CurrentUserChecker = async (action: Action): Promise<Session> => {
  const header = action.request.headers.authorization;
  if (!header) {
    throw new HttpStatusError(HttpStatus.Unauthorized, ErrorEnum.UnAuthorized);
  }

  const [, token] = header.split(" ");
  try {
    const { roles, sub } = verify(token, SystemConfig.Configs.AppSetting.SecretKey) as JwtPayload;
    return {
      _id: sub,
      roles,
    };
  } catch {
    throw new HttpStatusError(HttpStatus.Unauthorized, ErrorEnum.Token_Expired);
  }
};