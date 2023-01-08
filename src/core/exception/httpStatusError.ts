import { HttpStatus } from "@core/enums/httpStatus.enum";
import { ErrorEnum, ErrorMessageMapping } from "@core/enums/error.enum";
export class HttpStatusError extends Error {
  statusCode: HttpStatus;
  code: number;
  constructor(
    statusCode: HttpStatus = HttpStatus.InternalServerError,
    messageCode? : ErrorEnum,
    message?: string,
  ) {
    super(message);
    if(messageCode && ErrorMessageMapping.has(messageCode)){
      this.message = ErrorMessageMapping.get(messageCode);
    }
    this.statusCode = statusCode;
    this.code = messageCode;
    Object.setPrototypeOf(this, HttpStatusError.prototype);
  }
}

export { HttpStatus, ErrorEnum };