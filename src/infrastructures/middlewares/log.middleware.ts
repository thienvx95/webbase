import { Request, Response, NextFunction } from "express";
import * as morgan from "morgan";
import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
import { Logging } from "@core/log";
import { SystemConfig } from '@core/configuration';
import { injectable } from "inversify";

@injectable()
@Middleware({ type: "before" })
export class LogMiddleware implements ExpressMiddlewareInterface {
  public use(
    req: Request,
    res: Response,
    next: NextFunction
  ): any {

    return morgan(SystemConfig.Configs.LoggingSetting.Output, {
      stream: {
        write: function (message) {
          const log = Logging.getInstance("Request");
          log.info(message);
        },
      },
    })(req, res, next);
  }
}
