import { ResponseResult } from "@business/common/model/responseResult";
import { RoutingAPI } from "@core/constants";
import { injectable } from "inversify";
import { Interceptor, InterceptorInterface, Action } from "routing-controllers";

@injectable()
@Interceptor()
export class APIResponseInterceptor implements InterceptorInterface {
  intercept(action: Action, content: any): ResponseResult {
    if(action.request.url.indexOf(RoutingAPI.FileUpload) !== 0){
      return {
        data:content,
        success: true,
      } as ResponseResult;
    }
    return content;
  }
}