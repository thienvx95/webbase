import { ResponseResult } from "@business/common/model/responseResult";
import { injectable } from "inversify";
import { Interceptor, InterceptorInterface, Action } from "routing-controllers";

@injectable()
@Interceptor()
export class APIResponseInterceptor implements InterceptorInterface {
  intercept(_action: Action, content: any): ResponseResult {
    const result = new ResponseResult();
    result.data = content;
    result.success = true;
    return result;
  }
}