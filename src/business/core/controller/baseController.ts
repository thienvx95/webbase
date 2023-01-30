import { RoutingAPI } from '@core/constants';
import { Session } from '@business/auth/model';
import { ResponseResult } from '@business/common/model/responseResult';
import { ErrorMessageMapping } from '@core/enums/error.enum';
import { injectable } from 'inversify';
import { CacheKey } from '@core/enums/cacheKey.enum';
import { stringFormat } from '@core/ultis';

@injectable()
export class BaseController {
  Ok<T>(
    success: boolean,
    data?: T,
    errorCode?: number,
    message?: string,
    errors?: string[],
  ): ResponseResult<T> {
    if (success) {
      return {
        success,
        data,
      } as ResponseResult<T>;
    }

    if (!message && errorCode && ErrorMessageMapping.has(errorCode)) {
      message = ErrorMessageMapping.get(errorCode);
    }

    return {
      success,
      code: errorCode,
      errors: errors,
      message: message,
    } as ResponseResult<T>;
  }

  getCacheKey(cacheKey: CacheKey, ...args: string[]): string {
    return stringFormat(cacheKey, ...args);
  }
}

export { ResponseResult, RoutingAPI, Session };
