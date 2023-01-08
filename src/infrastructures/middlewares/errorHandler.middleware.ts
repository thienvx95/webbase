import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';
import {
  ExpressErrorMiddlewareInterface,
  Middleware,
} from 'routing-controllers';
import { Logging } from '@core/log';
import { HttpStatusError, HttpStatus } from '@core/exception/httpStatusError';
import { formatErrors } from '@core/ultis';
import { ResponseResult } from '@business/common/model/responseResult';
import { injectable } from 'inversify';

type Errors = {
  errors?: ValidationError[];
  httpCode?: number;
  statusCode?: number;
  message?: string;
  errorCode?: string;
} & HttpStatusError;

@injectable()
@Middleware({ type: 'after', priority: 10 })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
  public error(error: Errors, _req: Request, res: Response): Response {
    const log = Logging.getInstance('ErrorHandler');
    const responseResult = new ResponseResult();
    responseResult.success = false;
    responseResult.message = error.message;
    responseResult.code = error.code;
    
    if (error.statusCode && error.statusCode !== HttpStatus.InternalServerError) {
      if(error.errors){
        log.info(`[${error.code}]${error.message} - ${JSON.stringify(formatErrors(error.errors))}` );
      } else {
        log.info(`[${error.code}]${error.message}`);
      }
      return res.status(error.statusCode).json(responseResult);
    }

    if (error.httpCode === HttpStatus.BadRequest && error?.errors) {
      log.info(JSON.stringify(formatErrors(error.errors)));
      responseResult.errors = formatErrors(error.errors);
      return res.status(error.httpCode).json(responseResult);
    }

    responseResult.message = 'Internal server error';
    log.error(error?.stack ?? error.message);
    return res.status(HttpStatus.InternalServerError).json(responseResult);
  }
}
