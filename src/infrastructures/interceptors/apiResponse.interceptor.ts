import { ResponseResult } from "@business/common/model/responseResult";
import { Interceptor, InterceptorInterface, Action } from "routing-controllers";
import { Service } from "typedi";

@Interceptor()
@Service()
export class APIResponseInterceptor implements InterceptorInterface {
  intercept(_action: Action, content: any): ResponseResult {
    const result = new ResponseResult();
    result.data = content;
    result.success = true;
    return result;
  }
}