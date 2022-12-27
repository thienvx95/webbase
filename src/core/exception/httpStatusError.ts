import { HttpStatus } from "@core/enums/httpStatus.enum";
import { ErrorEnum, ErrorMessageMapping } from "@core/enums/error.enum";
export class HttpStatusError extends Error {
  statusCode: HttpStatus;
  errorCode: string;
  constructor(
    statusCode: HttpStatus = HttpStatus.InternalServerError,
    messageCode? : ErrorEnum,
    message?: string,
  ) {
    if(messageCode && ErrorMessageMapping.has(messageCode)){
      message = ErrorMessageMapping.get(messageCode);
    }
    super(message);
    this.statusCode = statusCode;
    this.errorCode = messageCode.toString();
    Object.setPrototypeOf(this, HttpStatusError.prototype);
  }
}

export { HttpStatus, ErrorEnum };