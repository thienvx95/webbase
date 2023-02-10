import { Action } from 'routing-controllers';
import {
  HttpStatusError,
  ErrorEnum,
  HttpStatus,
} from '@core/exception/httpStatusError';
import { Session } from '@business/auth/model';
import { getUserSession } from '@core/ultis';
export const CurrentUserChecker = async (action: Action): Promise<Session> => {
  const header = action.request.headers.authorization;
  if (!header) {
    throw new HttpStatusError(HttpStatus.Unauthorized, ErrorEnum.UnAuthorized);
  }

  const [, token] = header.split(' ');
  try {
    return getUserSession(action.request, token);
  } catch (e) {
    throw new HttpStatusError(HttpStatus.Unauthorized, ErrorEnum.Token_Expired);
  }
};
