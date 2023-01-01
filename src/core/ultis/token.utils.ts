import * as crypto from "crypto";
import { sign, SignOptions, verify } from 'jsonwebtoken';

import { SystemConfig } from '@core/configuration';
import { JwtPayload } from '@business/auth/model/jwtPayload.model';
import { HttpStatus, HttpStatusError } from "@core/exception/httpStatusError";

export class TokenUtil {
  public static async generateToken(payload: JwtPayload): Promise<string> {
    return new Promise((resolve, reject) => {
      const configs = SystemConfig.Configs.AppSetting;
      const options: SignOptions = {
        expiresIn: configs.jwtExpiresIn * 60,
      };
      sign(JSON.parse(JSON.stringify(payload)), configs.SecretKey, options, (err, token) => {
        if (err) reject(new HttpStatusError(HttpStatus.InternalServerError, null, err.message));

        resolve(String(token));
      });
    });
  }

  public static async verifyRefreshToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const secretKey = SystemConfig.Configs.AppSetting.SecretKey;

      verify(token, secretKey, (err: any, payload: any) => {
        if (err) reject(HttpStatus.Unauthorized);

        resolve(payload);
      });
    });
  }

  public static randomTokenString = (): string => {
    return crypto.randomBytes(40).toString('hex');
  };
}
