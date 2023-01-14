import { ResponseResult } from "@business/common/model/responseResult";
import { injectable } from "inversify";
import { Interceptor, InterceptorInterface, Action } from "routing-controllers";

@injectable()
@Interceptor()
export class APIResponseInterceptor implements InterceptorInterface {
  intercept(_action: Action, content: any): ResponseResult {
    return {
      data:content,
      success: true,
    } as ResponseResult;
  }
}