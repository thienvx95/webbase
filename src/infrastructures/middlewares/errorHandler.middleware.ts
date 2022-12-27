import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';
import {
  ExpressErrorMiddlewareInterface,
  HttpError,
  Middleware,
} from 'routing-controllers';
import { Service } from 'typedi';
import { Logging } from '@core/log';
import { HttpStatusError, HttpStatus } from '@core/exception/httpStatusError';
import { formatErrors } from '@core/ultis';
import { ErrorInfoRegex } from '@core/constants';
import { ResponseResult } from '@business/common/model/responseResult';

type Errors = {
  errors?: ValidationError[];
  httpCode?: number;
  statusCode?: number;
  message?: string;
  errorCode?: string;
} & HttpStatusError;

@Service()
@Middleware({ type: 'after', priority: 10 })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
  public error(error: Errors, _req: Request, res: Response): Response {
    const log = Logging.getInstance('ErrorHandler');
    const responseResult = new ResponseResult();
    responseResult.success = false;
    responseResult.message = error.message;
    responseResult.errorCode = error.errorCode;

    if (error.httpCode === HttpStatus.BadRequest && error?.errors) {
      log.info(JSON.stringify(formatErrors(error.errors)));
    } else {
      let method = null;
      if (error.stack) {
        const lines = error.stack.split('\n').slice(1);
        if (lines.length > 1) {
          const match = lines[0].match(ErrorInfoRegex);
          method = `[${match[0]}]`;
        }
      }
      log.info(error.message, method);
    }

    if (error.statusCode) {
      return res.status(error.statusCode).json(responseResult);
    }

    if (error.httpCode === HttpStatus.BadRequest && error?.errors) {
      responseResult.errors = formatErrors(error.errors);
      return res.status(error.httpCode).json(responseResult);
    }

    if (error instanceof HttpError) {
      return res.status(error.httpCode).json(responseResult);
    }

    responseResult.message = 'Internal server error';

    return res.status(HttpStatus.InternalServerError).json(responseResult);
  }
}
