import { Action } from "routing-controllers";
import { verify } from "jsonwebtoken";
import { HttpStatusError, ErrorEnum, HttpStatus } from "@core/exception/httpStatusError";
import { SystemConfig } from '@core/configuration';
import { JwtPayload } from "@business/auth/model/jwtPayload.model";
import { Role } from "@entities/roles/role.entity";
import { getModelForClass } from "@typegoose/typegoose";

export const AuthorizationChecker = async (
  action: Action,
  requirements: string[],
): Promise<boolean> => {
  const header = action.request.headers.authorization;

  if (!header) {
    throw new HttpStatusError(HttpStatus.Unauthorized, ErrorEnum.UnAuthorized);
  }

  const [, token] = header.split(" ");

  let roles: string[] = [];

  try {
    const scretKey = SystemConfig.Configs.AppSetting.SecretKey;
    const jwt = verify(token, scretKey) as JwtPayload;

    roles = jwt.roles;
  } catch {
    throw new HttpStatusError(HttpStatus.Unauthorized, ErrorEnum.Token_Expired);
  }

  const roleModel = getModelForClass(Role);
  if (
    requirements.length &&
    roles.every(role => requirements.every(async required => {
      if(!["Admin", "Member"].includes(role)){
        const result = await roleModel.findById(role);
        if(result && result.roleType !== required){
          return true;
        }
      }
      if(required !== role){
        return true;
      }
      return false;
    }))
  ) {
    throw new HttpStatusError(HttpStatus.Forbidden, ErrorEnum.UnAuthorized_Access);
  }

  return true;
};